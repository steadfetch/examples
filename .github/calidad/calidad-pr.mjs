#!/usr/bin/env node
// Gate común de las PRs de los repos de Steadfetch (calidad del código de los agentes, 10-11).
// Lo reparte steadfetch/ai-template; cada repo describe sus tests en .github/calidad/config.json.
// Sin dependencias: Node 22.
const MAX_BYTES = 1024 * 1024;
const ASSERT = /\b(expect|assert)\b|\.should\b/;
const TEST_FILE = /(^|\/)(test|tests|__tests__)\/|\.(test|spec)\.[cm]?[jt]sx?$|(^|\/)test_[^/]*\.py$/;

export function globToRegex(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      const slash = glob[i + 2] === "/";
      re += slash ? "(?:.*/)?" : ".*";
      i += slash ? 2 : 1;
    } else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp("^" + re + "$");
}

const coincide = (globs, ruta) => (globs || []).some((g) => globToRegex(g).test(ruta));

export function steDe(rama, titulo) {
  const m = /ste[-_ ]?(\d+)/i.exec(rama || "") || /ste[-_ ]?(\d+)/i.exec(titulo || "");
  return m ? "STE-" + m[1] : null;
}

// El ámbito de un archivo es la carpeta más larga que encaja con la `raiz` de algún ámbito.
function ambitoDe(ruta, ambitos) {
  const partes = ruta.split("/");
  let mejor = null;
  for (let n = partes.length - 1; n >= 0; n--) {
    const carpeta = partes.slice(0, n).join("/");
    const a = ambitos.find((x) => globToRegex(x.raiz).test(carpeta));
    if (a) { mejor = { carpeta, ambito: a }; break; }
  }
  return mejor;
}

export function clasificar(archivos, config) {
  const ambitos = new Map();
  const otros = [];
  for (const ruta of archivos) {
    const hit = ambitoDe(ruta, config.ambitos || []);
    if (!hit) { otros.push(ruta); continue; }
    const rel = hit.carpeta ? ruta.slice(hit.carpeta.length + 1) : ruta;
    if (!ambitos.has(hit.carpeta)) ambitos.set(hit.carpeta, { codigo: [], tests: [] });
    const grupo = ambitos.get(hit.carpeta);
    if (coincide(hit.ambito.tests, rel)) grupo.tests.push(rel);
    else if (coincide(hit.ambito.codigo, rel)) grupo.codigo.push(rel);
  }
  return { ambitos, otros };
}

export function contarTamano(numstat, config) {
  const filas = numstat.filter((f) => !coincide(config.ignorarTamano, f.ruta));
  const lineas = filas.reduce((s, f) => s + (Number(f.añadidas) || 0) + (Number(f.borradas) || 0), 0);
  return { archivos: filas.length, lineas };
}

export function prohibidos(archivos, tamaños) {
  return archivos.filter((ruta) => {
    const base = ruta.split("/").pop();
    if (ruta.split("/").includes("node_modules")) return true;
    if (ruta.split("/").includes(".paperclip-runtime")) return true;
    if (/^\.env(\..*)?$/.test(base) && base !== ".env.example") return true;
    return (tamaños.get(ruta) || 0) > MAX_BYTES;
  });
}

// Asserts borrados (o sustituidos) en archivos de test: no bloquea, lo contesta el Revisor.
export function assertsRebajados(diff) {
  const out = [];
  let ruta = null;
  let linea = 0;
  for (const l of diff.split(/\r?\n/)) {
    if (l.startsWith("diff --git ")) { ruta = null; continue; }
    if (l.startsWith("--- ")) continue;
    if (l.startsWith("+++ ")) { const r = l.slice(4).replace(/^b\//, ""); ruta = TEST_FILE.test(r) ? r : null; continue; }
    const h = /^@@ -(\d+)/.exec(l);
    if (h) { linea = Number(h[1]); continue; }
    if (!ruta) continue;
    if (l.startsWith("-")) {
      if (ASSERT.test(l)) out.push({ ruta, linea, texto: l.slice(1).trim() });
      linea++;
    } else if (!l.startsWith("+")) linea++;
  }
  return out;
}

// ---------------------------------------------------------------- CLI
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 << 20 });

function opciones(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 2) o[argv[i].replace(/^--/, "")] = argv[i + 1];
  return o;
}

// La configuración sale de la base: una PR no puede cambiar cómo se la comprueba.
function configDe(base) {
  try { return JSON.parse(git("show", base + ":.github/calidad/config.json")); } catch { return { ambitos: [] }; }
}

function tieneConfig(sha) {
  try { git("cat-file", "-e", sha + ":.github/calidad/config.json"); return true; } catch { return false; }
}

function cambiados(base, head) {
  return git("diff", "--name-only", "--diff-filter=ACMR", base, head).split("\n").filter(Boolean);
}

function ejecutarEnBase(base, head, carpeta, ambito, tests) {
  const dir = mkdtempSync(join(tmpdir(), "calidad-base-"));
  rmSync(dir, { recursive: true, force: true });
  git("worktree", "add", "-q", "--detach", dir, base);
  try {
    for (const t of tests) {
      const ruta = carpeta ? carpeta + "/" + t : t;
      mkdirSync(dirname(join(dir, ruta)), { recursive: true });
      writeFileSync(join(dir, ruta), git("show", head + ":" + ruta));
    }
    const cwd = join(dir, carpeta);
    if (ambito.instalar) spawnSync(ambito.instalar, { cwd, shell: true, stdio: "inherit" });
    const r = spawnSync(ambito.comando.replace("{tests}", tests.join(" ")), { cwd, shell: true, stdio: "inherit" });
    return r.status;
  } finally {
    git("worktree", "remove", "--force", dir);
  }
}

function rojo({ base, head }) {
  const mb = git("merge-base", base, head).trim();
  const config = configDe(mb);
  const { ambitos } = clasificar(cambiados(mb, head), config);
  const conCodigo = [...ambitos].filter(([, g]) => g.codigo.length);
  if (!conCodigo.length) return ok("sin código: no aplica");
  const motivos = [];
  for (const [carpeta, g] of conCodigo) {
    const ambito = ambitoDe(carpeta + "/x", config.ambitos).ambito;
    if (!g.tests.length) { motivos.push(`${carpeta || "."}: cambia código sin test`); continue; }
    if (ejecutarEnBase(mb, head, carpeta, ambito, g.tests) === 0) motivos.push(`${carpeta || "."}: los tests nuevos pasan sin el cambio, así que no prueban nada`);
  }
  return motivos.length ? falla(motivos) : ok("los tests de la PR fallan sin el cambio");
}

function tamano({ base, head }) {
  const mb = git("merge-base", base, head).trim();
  const filas = git("diff", "--numstat", mb, head).split("\n").filter(Boolean).map((l) => {
    const [añadidas, borradas, ruta] = l.split("\t");
    return { ruta, añadidas, borradas };
  });
  const t = contarTamano(filas, configDe(mb));
  if (t.archivos > 15 || t.lineas > 800) return falla([`${t.archivos} archivos y ${t.lineas} líneas: el máximo es 15 archivos y 800 líneas (parte la tarea)`]);
  return ok(`${t.archivos} archivos y ${t.lineas} líneas`);
}

function prohibidosCli({ base, head }) {
  const mb = git("merge-base", base, head).trim();
  const archivos = cambiados(mb, head);
  const tamaños = new Map(archivos.map((r) => [r, Number(git("cat-file", "-s", head + ":" + r).trim())]));
  const malos = prohibidos(archivos, tamaños);
  return malos.length ? falla(malos.map((r) => `archivo prohibido en el diff: ${r}`)) : ok("sin archivos prohibidos");
}

function asserts({ base, head }) {
  const mb = git("merge-base", base, head).trim();
  for (const a of assertsRebajados(git("diff", mb, head))) {
    console.log(`::warning file=${a.ruta},line=${a.linea}::assert borrado o cambiado: ${a.texto} (el Revisor tiene que contestarlo)`);
  }
  return 0;
}

function unaPr({ pr, repo, rama, titulo }) {
  const ste = steDe(rama, titulo);
  if (!ste) return falla(["la rama o el título tienen que llevar STE-<n>"]);
  const abiertas = JSON.parse(execFileSync("gh", ["pr", "list", "--repo", repo, "--state", "open", "--json", "number,headRefName,title", "--limit", "200"], { encoding: "utf8" }));
  const otras = abiertas.filter((p) => String(p.number) !== String(pr) && steDe(p.headRefName, p.title) === ste);
  if (otras.length) return falla([`${ste} ya tiene otra PR abierta: ${otras.map((p) => "#" + p.number).join(", ")}. Los cambios van a esa PR`]);
  return ok(`${ste}: una sola PR`);
}

function ok(msg) { console.log("OK: " + msg); return 0; }
function falla(motivos) { for (const m of motivos) console.log("FALLA: " + m); return 1; }

const COMPROBACIONES = { rojo, tamano, prohibidos: prohibidosCli, asserts, "una-pr": unaPr };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [cmd, ...resto] = process.argv.slice(2);
  const fn = COMPROBACIONES[cmd];
  if (!fn) { console.error("Uso: calidad-pr.mjs <" + Object.keys(COMPROBACIONES).join("|") + "> --base <sha> --head <sha>"); process.exit(2); }
  const o = opciones(resto);
  // El gate es de los repos donde escriben agentes: los que tienen su configuración en la base. El resto lo recibe
  // con la plantilla pero no lo usa (paperclip, examples).
  if (o.base && !tieneConfig(o.base)) { ok("este repo no usa el gate (no hay .github/calidad/config.json)"); process.exit(0); }
  process.exitCode = fn(o);
}

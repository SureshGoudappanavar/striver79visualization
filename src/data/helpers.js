export function setTBox(valId, trackerId, val) {
  const el = document.getElementById(valId);
  if (el) el.textContent = val === undefined ? '—' : val;
}

export function addLogLine(logId, text, type='info') {
  const log = document.getElementById(logId);
  if (!log) return;
  const el = document.createElement('div');
  el.className = `log-line ${type}`;
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

export function renderTree(containerId, tree, curIdx, visitedIdxs) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const W = 400, H = 180;
  const pos = {};
  const getPos = (i, depth, left, right) => {
    if (i >= tree.length || tree[i] === null) return;
    const x = (left + right) / 2;
    const y = 30 + depth * 55;
    pos[i] = {x, y};
    getPos(2*i+1, depth+1, left, (left+right)/2);
    getPos(2*i+2, depth+1, (left+right)/2, right);
  };
  getPos(0, 0, 0, W);
  let svg = `<svg class="tree-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  for (let i = 0; i < tree.length; i++) {
    if (tree[i] === null || !pos[i]) continue;
    const li = 2*i+1, ri = 2*i+2;
    if (li < tree.length && tree[li] !== null && pos[li]) svg += `<line x1="${pos[i].x}" y1="${pos[i].y}" x2="${pos[li].x}" y2="${pos[li].y}" class="tree-edge"/>`;
    if (ri < tree.length && tree[ri] !== null && pos[ri]) svg += `<line x1="${pos[i].x}" y1="${pos[i].y}" x2="${pos[ri].x}" y2="${pos[ri].y}" class="tree-edge"/>`;
  }
  for (let i = 0; i < tree.length; i++) {
    if (tree[i] === null || !pos[i]) continue;
    const cls = i===curIdx?'cur':visitedIdxs.includes(i)?'visited':'';
    svg += `<g class="tree-node ${cls}"><circle cx="${pos[i].x}" cy="${pos[i].y}" r="18"/><text x="${pos[i].x}" y="${pos[i].y}">${tree[i]}</text></g>`;
  }
  svg += '</svg>';
  el.innerHTML = svg;
}


export function renderGraph(containerId, graph, pos, curNode, visited, order) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const visitedSet = new Set(Array.isArray(visited) ? visited : [...(visited||[])]);
  const orderSet = new Set(Array.isArray(order) ? order : [...(order||[])]);
  let svg = '';
  // Draw edges
  for (const [u, neighbors] of Object.entries(graph)) {
    for (const v of neighbors) {
      const pu = pos[u], pv = pos[v];
      if (pu && pv) svg += `<line x1="${pu.x}" y1="${pu.y}" x2="${pv.x}" y2="${pv.y}" stroke="var(--border2)" stroke-width="2"/>`;
    }
  }
  // Draw nodes
  for (const [node, p] of Object.entries(pos)) {
    const n = parseInt(node);
    const isCur = n === curNode;
    const isVisited = visitedSet.has(n);
    const isOrder = orderSet.includes ? orderSet.includes(n) : orderSet.has(n);
    const fill = isCur ? 'rgba(245,158,11,0.3)' : isVisited ? 'rgba(16,185,129,0.15)' : 'var(--surface2)';
    const stroke = isCur ? 'var(--orange)' : isVisited ? 'var(--green)' : 'var(--border2)';
    svg += `<circle cx="${p.x}" cy="${p.y}" r="20" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    svg += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-family="var(--mono)" font-size="13" font-weight="700" fill="var(--text)">${n}</text>`;
  }
  el.innerHTML = svg;
}

// ===================== STATE =====================
let currentFilter = 'all';
let currentViz = null;
let vizSteps = [];
let vizStep = 0;
let autoTimer = null;
let vizNums = null;

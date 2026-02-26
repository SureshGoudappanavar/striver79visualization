export const VISUALIZERS = {

  kadane: {
    title: "Kadane's Algorithm — Max Subarray Sum",
    desc: `Track <code>currentSum<\/code> and <code>maxSum<\/code>. If currentSum goes negative, reset it to 0. The key insight: a negative prefix only hurts us, so we drop it.`,
    init: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    presets: [[-2,1,-3,4,-1,2,1,-5,4], [1,2,3,-2,5], [-1,-2,-3]],
    run(nums) {
      const steps = [];
      let cur = 0, mx = -Infinity;
      steps.push({ arr: [...nums], i: -1, cur, mx, note: `Start. currentSum=0, maxSum=-∞`, type:'info' });
      for (let i = 0; i < nums.length; i++) {
        cur += nums[i];
        const prevMx = mx;
        mx = Math.max(mx, cur);
        if (cur < 0) {
          steps.push({ arr: [...nums], i, cur, mx, note: `i=${i}: add ${nums[i]} → cur=${cur}. Negative! Reset to 0. maxSum=${mx}`, type:'info', resetNext: true });
          cur = 0;
        } else {
          steps.push({ arr: [...nums], i, cur, mx, note: `i=${i}: add ${nums[i]} → cur=${cur}. ${mx > prevMx ? `✦ New max=${mx}` : `maxSum=${mx}`}`, type: mx > prevMx ? 'success':'info' });
        }
      }
      steps[steps.length-1].done = true;
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="arr-wrap" id="vArr"></div>
        <div class="trackers">
          <div class="tbox blue" id="tCur"><div class="tbox-label">currentSum</div><div class="tbox-val" id="tvCur">0</div></div>
          <div class="tbox green" id="tMx"><div class="tbox-label">maxSum</div><div class="tbox-val" id="tvMx">-∞</div></div>
        </div>
        <div class="viz-label">// step log</div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const arr = document.getElementById('vArr');
      arr.innerHTML = nums.map((v,i) => `<div class="cell ${i===step.i?'cur':''} ${v>0?'positive':v<0?'negative':''}" data-i="${i}"><span class="ci">${i}</span>${v}</div>`).join('');
      setTBox('tvCur','tCur', step.cur === undefined ? '0' : step.cur);
      setTBox('tvMx','tMx', step.mx === -Infinity ? '-∞' : step.mx);
      addLogLine('vLog', step.note, step.type==='success'?'success':step.done?'highlight':'info');
    }
  },

  dutchFlag: {
    title: 'Dutch National Flag — Sort 0s, 1s, 2s',
    desc: `Three-pointer approach: <code>low<\/code>, <code>mid<\/code>, <code>high<\/code>. Elements before low are 0s, after high are 2s, between low and mid are 1s.`,
    init: [2, 0, 2, 1, 1, 0],
    presets: [[2,0,2,1,1,0],[0,1,2,0,1,2],[2,2,0,0,1,1]],
    run(nums) {
      const arr = [...nums];
      const steps = [];
      let lo = 0, mid = 0, hi = arr.length - 1;
      steps.push({ arr:[...arr], lo, mid, hi, note:`Init: lo=0, mid=0, hi=${hi}`, type:'info' });
      while (mid <= hi) {
        if (arr[mid] === 0) {
          [arr[lo], arr[mid]] = [arr[mid], arr[lo]];
          steps.push({ arr:[...arr], lo, mid, hi, note:`arr[mid]=${arr[mid-1]===0?0:arr[mid]} was 0 → swap with lo(${lo}). lo++, mid++`, type:'info', swapped:[lo-1,mid-1] });
          lo++; mid++;
        } else if (arr[mid] === 1) {
          steps.push({ arr:[...arr], lo, mid, hi, note:`arr[mid]=${arr[mid]} is 1 → already in place. mid++`, type:'info' });
          mid++;
        } else {
          [arr[mid], arr[hi]] = [arr[hi], arr[mid]];
          steps.push({ arr:[...arr], lo, mid, hi:hi-1, note:`arr[mid]=${arr[hi]} was 2 → swap with hi(${hi}). hi--`, type:'info', swapped:[mid,hi-1] });
          hi--;
        }
      }
      steps[steps.length-1].done = true;
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="ptr-row" id="vPtr"></div>
        <div class="arr-wrap" id="vArr"></div>
        <div class="trackers">
          <div class="tbox green"><div class="tbox-label">lo</div><div class="tbox-val" id="tvLo">0</div></div>
          <div class="tbox blue"><div class="tbox-label">mid</div><div class="tbox-val" id="tvMid">0</div></div>
          <div class="tbox pink"><div class="tbox-label">hi</div><div class="tbox-val" id="tvHi">${nums.length-1}</div></div>
        </div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const colors = ['#10b981','#94a3b8','#ef4444'];
      const arr = document.getElementById('vArr');
      arr.innerHTML = step.arr.map((v,i) => {
        let cls = '';
        if(i===step.lo) cls='left';
        if(i===step.mid) cls='cur';
        if(i===step.hi) cls='right';
        if(step.swapped && step.swapped.includes(i)) cls='swapped';
        return `<div class="cell ${cls}" style="${v===0?'color:#10b981':v===2?'color:#ef4444':''}"><span class="ci">${i}</span>${v}</div>`;
      }).join('');
      document.getElementById('tvLo').textContent = step.lo;
      document.getElementById('tvMid').textContent = step.mid;
      document.getElementById('tvHi').textContent = step.hi;
      addLogLine('vLog', step.note, step.done?'highlight':'info');
    }
  },

  binarySearch: {
    title: 'Binary Search',
    desc: `Each step, eliminate half the array. If <code>arr[mid] === target<\/code>, found! If target > arr[mid], search right half. Else search left half.`,
    init: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    target: 13,
    presets: [[1,3,5,7,9,11,13,15,17,19],[2,4,6,8,10,12],[1,2,3,4,5]],
    run(nums, target) {
      target = target || 13;
      const steps = [];
      let lo = 0, hi = nums.length - 1;
      steps.push({ arr:[...nums], lo, hi, mid:-1, target, note:`Search for ${target}. lo=0, hi=${hi}`, type:'info' });
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        steps.push({ arr:[...nums], lo, hi, mid, target, note:`mid=${mid} → arr[mid]=${nums[mid]}. Target=${target}.`, type:'info' });
        if (nums[mid] === target) {
          steps.push({ arr:[...nums], lo, hi, mid, target, found:mid, note:`✦ Found ${target} at index ${mid}!`, type:'success' });
          break;
        } else if (nums[mid] < target) {
          steps.push({ arr:[...nums], lo:mid+1, hi, mid, target, note:`${nums[mid]} < ${target} → search right. lo = mid+1 = ${mid+1}`, type:'info' });
          lo = mid + 1;
        } else {
          steps.push({ arr:[...nums], lo, hi:mid-1, mid, target, note:`${nums[mid]} > ${target} → search left. hi = mid-1 = ${mid-1}`, type:'info' });
          hi = mid - 1;
        }
      }
      if (steps[steps.length-1].type !== 'success') {
        steps.push({ arr:[...nums], lo, hi:-1, mid:-1, target, note:`Not found! lo > hi`, type:'info', done:true });
      }
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="ptr-row" id="vPtr"></div>
        <div class="arr-wrap" id="vArr"></div>
        <div class="trackers">
          <div class="tbox green"><div class="tbox-label">lo</div><div class="tbox-val" id="tvLo">0</div></div>
          <div class="tbox blue"><div class="tbox-label">mid</div><div class="tbox-val" id="tvMid">—</div></div>
          <div class="tbox pink"><div class="tbox-label">hi</div><div class="tbox-val" id="tvHi">${nums.length-1}</div></div>
          <div class="tbox purple"><div class="tbox-label">target</div><div class="tbox-val" id="tvT">${step.target||13}</div></div>
        </div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const arr = document.getElementById('vArr');
      arr.innerHTML = step.arr.map((v,i) => {
        let cls = '';
        if (step.found === i) cls = 'found';
        else if (i === step.mid) cls = 'cur';
        else if (i === step.lo) cls = 'left';
        else if (i === step.hi) cls = 'right';
        else if (i < step.lo || i > step.hi) cls = 'sorted';
        return `<div class="cell ${cls}"><span class="ci">${i}</span>${v}</div>`;
      }).join('');
      document.getElementById('tvLo').textContent = step.lo;
      document.getElementById('tvMid').textContent = step.mid >= 0 ? step.mid : '—';
      document.getElementById('tvHi').textContent = step.hi;
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  stockBuySell: {
    title: 'Best Time to Buy and Sell Stock',
    desc: `Track the <code>minPrice<\/code> seen so far. At each day, the max profit if we sell today = <code>price - minPrice<\/code>. One pass O(n).`,
    init: [7, 1, 5, 3, 6, 4],
    presets: [[7,1,5,3,6,4],[7,6,4,3,1],[1,2,3,4,5]],
    run(nums) {
      const steps = [];
      let minP = Infinity, maxProfit = 0;
      steps.push({ arr:[...nums], i:-1, minP, maxProfit, note:'Start scanning prices.', type:'info' });
      for (let i = 0; i < nums.length; i++) {
        const prev = minP;
        minP = Math.min(minP, nums[i]);
        const profit = nums[i] - minP;
        const prevMax = maxProfit;
        maxProfit = Math.max(maxProfit, profit);
        let note = `Day ${i}: price=${nums[i]}. `;
        if (nums[i] < prev) note += `New minPrice=${minP}. `;
        note += `Profit if sell today=${profit}. maxProfit=${maxProfit}`;
        steps.push({ arr:[...nums], i, minP, maxProfit, note, type: maxProfit > prevMax ? 'success':'info' });
      }
      steps[steps.length-1].done = true;
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="arr-wrap" id="vArr"></div>
        <div class="trackers">
          <div class="tbox blue"><div class="tbox-label">minPrice</div><div class="tbox-val" id="tvMin">∞</div></div>
          <div class="tbox green"><div class="tbox-label">maxProfit</div><div class="tbox-val" id="tvMax">0</div></div>
        </div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const arr = document.getElementById('vArr');
      arr.innerHTML = step.arr.map((v,i) => `<div class="cell ${i===step.i?'cur':i<step.i?'sorted':''}"><span class="ci">D${i}</span>${v}</div>`).join('');
      document.getElementById('tvMin').textContent = step.minP === Infinity ? '∞' : step.minP;
      document.getElementById('tvMax').textContent = step.maxProfit;
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  nextPermutation: {
    title: 'Next Permutation',
    desc: `Step 1: Find largest index <code>i<\/code> where arr[i] < arr[i+1]. Step 2: Find rightmost element > arr[i]. Step 3: Swap them. Step 4: Reverse suffix after i.`,
    init: [1, 2, 3],
    presets: [[1,2,3],[3,2,1],[1,1,5],[2,3,1,3,3]],
    run(nums) {
      const arr = [...nums];
      const steps = [];
      steps.push({ arr:[...arr], phase:'scan', note:`Find pivot: scan right-to-left for arr[i] < arr[i+1]`, type:'info', mark:[] });
      let i = arr.length - 2;
      while (i >= 0 && arr[i] >= arr[i+1]) i--;
      if (i < 0) {
        arr.reverse();
        steps.push({ arr:[...arr], phase:'done', note:`No pivot found (descending order). Reverse entire array → smallest permutation.`, type:'success', done:true, mark:[] });
        return steps;
      }
      steps.push({ arr:[...arr], phase:'found', note:`Pivot found at index ${i} (value ${arr[i]}).`, type:'info', mark:[i] });
      let j = arr.length - 1;
      while (arr[j] <= arr[i]) j--;
      steps.push({ arr:[...arr], phase:'swap', note:`Rightmost element > pivot: index ${j} (value ${arr[j]}). Swap!`, type:'info', mark:[i,j] });
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push({ arr:[...arr], phase:'swapped', note:`Swapped. Now reverse suffix after index ${i}.`, type:'info', mark:[i] });
      let l = i+1, r = arr.length-1;
      while (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }
      steps.push({ arr:[...arr], phase:'done', note:`✦ Next permutation: [${arr.join(', ')}]`, type:'success', done:true, mark:[] });
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="arr-wrap" id="vArr"></div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const arr = document.getElementById('vArr');
      arr.innerHTML = step.arr.map((v,i) => `<div class="cell ${step.mark&&step.mark.includes(i)?'swapped':''}"><span class="ci">${i}</span>${v}</div>`).join('');
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  reverseLL: {
    title: 'Reverse a Linked List',
    desc: `Use three pointers: <code>prev=null<\/code>, <code>cur<\/code>, <code>next<\/code>. At each step, reverse the link and advance all three pointers.`,
    init: [1,2,3,4,5],
    presets: [[1,2,3,4,5],[1,2,3],[5,4,3,2,1]],
    run(nums) {
      const steps = [];
      let prev = -1, cur = 0;
      steps.push({ nodes:[...nums], prev, cur, next:cur+1, note:`Init: prev=null, cur=head(${nums[0]})`, type:'info' });
      while (cur < nums.length) {
        const nxt = cur + 1;
        steps.push({ nodes:[...nums], prev, cur, next:nxt < nums.length ? nxt : -1, note:`Reverse link: ${cur >= 0 && cur < nums.length ? nums[cur] : 'null'} → ${prev >= 0 ? nums[prev] : 'null'}. Advance pointers.`, type:'info', reversed: cur });
        prev = cur;
        cur = nxt;
      }
      steps.push({ nodes:[...nums].reverse(), prev, cur:-1, next:-1, note:`✦ List reversed! New head=${nums[nums.length-1]}`, type:'success', done:true });
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="ll-wrap" id="vLL"></div>
        <div class="trackers">
          <div class="tbox orange"><div class="tbox-label">prev</div><div class="tbox-val" id="tvPrev">null</div></div>
          <div class="tbox blue"><div class="tbox-label">cur</div><div class="tbox-val" id="tvCur">—</div></div>
          <div class="tbox purple"><div class="tbox-label">next</div><div class="tbox-val" id="tvNxt">—</div></div>
        </div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const ll = document.getElementById('vLL');
      ll.innerHTML = step.nodes.map((v,i) => {
        let cls = '';
        if (i === step.cur) cls = 'cur';
        else if (i === step.prev) cls = 'prev-p';
        else if (i === step.next) cls = 'fast-p';
        const arrow = i < step.nodes.length-1 ? '<span class="ll-arrow">→</span>' : '';
        return `<div class="ll-node"><div class="ll-box ${cls}">${v}</div></div>${arrow}`;
      }).join('');
      document.getElementById('tvPrev').textContent = step.prev >= 0 ? nums[step.prev] ?? step.nodes[step.prev] : 'null';
      document.getElementById('tvCur').textContent = step.cur >= 0 ? step.nodes[step.cur] ?? '—' : 'null';
      document.getElementById('tvNxt').textContent = step.next >= 0 ? step.nodes[step.next] ?? '—' : 'null';
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  middleLL: {
    title: 'Middle of Linked List — Slow & Fast Pointer',
    desc: `<code>fast<\/code> moves 2 steps, <code>slow<\/code> moves 1 step. When fast reaches end, slow is at the middle. This is the Floyd's tortoise trick.`,
    init: [1,2,3,4,5],
    presets: [[1,2,3,4,5],[1,2,3,4],[1,2,3]],
    run(nums) {
      const steps = [];
      let slow = 0, fast = 0;
      steps.push({ nodes:[...nums], slow, fast, note:`Init: slow=head, fast=head`, type:'info' });
      while (fast < nums.length-1 && fast+1 < nums.length-1) {
        fast += 2; slow += 1;
        steps.push({ nodes:[...nums], slow, fast: Math.min(fast, nums.length-1), note:`fast moves 2→ idx ${Math.min(fast,nums.length-1)}. slow moves 1→ idx ${slow}`, type:'info' });
      }
      if (fast < nums.length - 1) { fast++; slow++; }
      steps.push({ nodes:[...nums], slow, fast: Math.min(fast,nums.length-1), note:`fast at end. slow at middle (idx ${slow}, value ${nums[slow]})`, type:'success', done:true, midIdx:slow });
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="ll-wrap" id="vLL"></div>
        <div class="trackers">
          <div class="tbox green"><div class="tbox-label">slow (×1)</div><div class="tbox-val" id="tvSlow">0</div></div>
          <div class="tbox pink"><div class="tbox-label">fast (×2)</div><div class="tbox-val" id="tvFast">0</div></div>
        </div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const ll = document.getElementById('vLL');
      ll.innerHTML = step.nodes.map((v,i) => {
        let cls = '';
        if (i === step.slow && i === step.fast) cls = 'slow-p';
        else if (i === step.slow) cls = 'slow-p';
        else if (i === step.fast) cls = 'fast-p';
        if (step.midIdx === i) cls = 'found-cycle';
        const arrow = i < step.nodes.length-1 ? '<span class="ll-arrow">→</span>' : '';
        const lbl = i===step.slow&&i===step.fast?'S/F':i===step.slow?'S':i===step.fast?'F':'';
        return `<div class="ll-node"><div class="ll-box ${cls}">${lbl?`<span class="ll-lbl">${lbl}</span>`:''}${v}</div></div>${arrow}`;
      }).join('');
      document.getElementById('tvSlow').textContent = step.nodes[step.slow];
      document.getElementById('tvFast').textContent = step.nodes[step.fast];
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  detectCycle: {
    title: 'Detect Cycle in Linked List — Floyd\'s Algorithm',
    desc: `Slow moves 1 step, fast moves 2 steps. If there's a cycle, they will eventually meet. If fast reaches null, no cycle exists.`,
    init: [3,2,0,-4],
    run(nums) {
      const steps = [];
      const n = nums.length;
      let slow = 0, fast = 0;
      steps.push({ nodes:[...nums], slow, fast, note:`Init both at head. This list has a cycle (tail connects to index 1).`, type:'info' });
      for (let t = 0; t < n*2; t++) {
        fast = (fast + 2) % n;
        slow = (slow + 1) % n;
        steps.push({ nodes:[...nums], slow, fast, note:`slow→${nums[slow]}(idx${slow}), fast→${nums[fast]}(idx${fast})${slow===fast?' — They MET! Cycle detected!':''}`, type: slow===fast?'success':'info' });
        if (slow === fast) {
          steps[steps.length-1].done = true;
          steps[steps.length-1].cycleAt = slow;
          break;
        }
      }
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="ll-wrap" id="vLL"></div>
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text3);margin:8px 0 12px;text-align:center;">↩ tail connects back to index 1 (simulated cycle)</div>
        <div class="trackers">
          <div class="tbox green"><div class="tbox-label">slow</div><div class="tbox-val" id="tvSlow">—</div></div>
          <div class="tbox pink"><div class="tbox-label">fast</div><div class="tbox-val" id="tvFast">—</div></div>
        </div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const ll = document.getElementById('vLL');
      ll.innerHTML = step.nodes.map((v,i) => {
        let cls = '';
        if (step.cycleAt === i) cls = 'found-cycle';
        else if (i===step.slow && i===step.fast) cls = 'slow-p';
        else if (i===step.slow) cls = 'slow-p';
        else if (i===step.fast) cls = 'fast-p';
        const arrow = i < step.nodes.length-1 ? '<span class="ll-arrow">→</span>' : '<span class="ll-arrow" style="color:var(--red)">↩</span>';
        const lbl = i===step.slow&&i===step.fast?'S+F':i===step.slow?'S':i===step.fast?'F':'';
        return `<div class="ll-node"><div class="ll-box ${cls}">${lbl?`<span class="ll-lbl">${lbl}</span>`:''}${v}</div></div>${arrow}`;
      }).join('');
      document.getElementById('tvSlow').textContent = nums[step.slow];
      document.getElementById('tvFast').textContent = nums[step.fast];
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  validParens: {
    title: 'Valid Parentheses — Stack',
    desc: `Push opening brackets onto the stack. When we see a closing bracket, check if it matches the top of the stack. If stack is empty at the end → valid.`,
    init: '({[]})',
    presets: ['({[]})', '([)]', '{[]}', '((()'],
    run(str) {
      const steps = [];
      const stack = [];
      const match = {')':'(',']':'[','}':'{'};
      steps.push({ str, i:-1, stack:[], note:`Input: "${str}". Push opens, pop on closes.`, type:'info' });
      for (let i = 0; i < str.length; i++) {
        const c = str[i];
        const prevStack = [...stack];
        if ('([{'.includes(c)) {
          stack.push(c);
          steps.push({ str, i, stack:[...stack], note:`'${c}' is opening → push onto stack.`, type:'info' });
        } else {
          const top = stack[stack.length-1];
          if (top === match[c]) {
            stack.pop();
            steps.push({ str, i, stack:[...stack], note:`'${c}' matches top '${top}' → pop. ✓`, type:'success' });
          } else {
            steps.push({ str, i, stack:[...stack], note:`'${c}' doesn't match top '${top||'empty'}' → INVALID!`, type:'info', invalid:true });
            steps[steps.length-1].done = true;
            return steps;
          }
        }
      }
      steps.push({ str, i:str.length, stack:[], note: stack.length===0?`✦ Stack empty → VALID parentheses!`:`Stack not empty → INVALID`, type: stack.length===0?'success':'info', done:true });
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:8px 0 16px;" id="vChars"></div>
        <div style="display:flex;gap:24px;justify-content:center;align-items:flex-end;min-height:120px;">
          <div>
            <div class="stack-col" id="vStack"></div>
            <div class="stack-label">STACK</div>
          </div>
        </div>
        <div class="step-log" id="vLog" style="margin-top:16px;"></div>`;
    },
    update(step, str) {
      const chars = document.getElementById('vChars');
      const s = typeof str === 'string' ? str : VISUALIZERS.validParens.init;
      chars.innerHTML = s.split('').map((c,i) => `<div class="cell" style="${i===step.i?'border-color:var(--blue);color:var(--blue-light);transform:translateY(-6px);':i<step.i?'opacity:0.4;':''}">${c}</div>`).join('');
      const stackEl = document.getElementById('vStack');
      stackEl.innerHTML = step.stack.map((c,i) => `<div class="stack-item ${i===step.stack.length-1?'top':''}">${c}</div>`).join('') || '<div style="color:var(--text3);font-family:var(--mono);font-size:0.7rem;">empty</div>';
      addLogLine('vLog', step.note, step.type==='success'?'success':step.invalid?'highlight':'info');
    }
  },

  maxProduct: {
    title: 'Max Product Subarray — DP',
    desc: `Track both <code>maxSoFar<\/code> and <code>minSoFar<\/code> — because negative × negative = positive, the min can become the new max!`,
    init: [2, 3, -2, 4],
    presets: [[2,3,-2,4],[-2,0,-1],[-2,-3,-4],[5,0,3]],
    run(nums) {
      const steps = [];
      let maxS = nums[0], minS = nums[0], res = nums[0];
      steps.push({ arr:[...nums], i:0, maxS, minS, res, note:`Init at idx 0: all = ${nums[0]}`, type:'info' });
      for (let i = 1; i < nums.length; i++) {
        const c = nums[i];
        const prevMax = maxS, prevMin = minS, prevRes = res;
        const tempMax = Math.max(c, prevMax*c, prevMin*c);
        const tempMin = Math.min(c, prevMax*c, prevMin*c);
        maxS = tempMax; minS = tempMin;
        res = Math.max(res, maxS);
        steps.push({ arr:[...nums], i, maxS, minS, res, note:`i=${i} cur=${c}. candidates:[${c},${prevMax}×${c}=${prevMax*c},${prevMin}×${c}=${prevMin*c}] → max=${maxS} min=${minS}${res>prevRes?` ✦ result→${res}`:''}`, type:res>prevRes?'success':'info' });
      }
      steps[steps.length-1].done = true;
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="arr-wrap" id="vArr"></div>
        <div class="trackers">
          <div class="tbox green"><div class="tbox-label">maxSoFar</div><div class="tbox-val" id="tvMax">—</div></div>
          <div class="tbox pink"><div class="tbox-label">minSoFar</div><div class="tbox-val" id="tvMin">—</div></div>
          <div class="tbox blue"><div class="tbox-label">result</div><div class="tbox-val" id="tvRes">—</div></div>
        </div>
        <div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const arr = document.getElementById('vArr');
      arr.innerHTML = step.arr.map((v,i) => `<div class="cell ${i===step.i?'cur':''} ${v>0?'':''}"><span class="ci">${i}</span>${v}</div>`).join('');
      setTBox('tvMax','',step.maxS); setTBox('tvMin','',step.minS); setTBox('tvRes','',step.res);
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  lcs: {
    title: 'Longest Common Subsequence — DP Table',
    desc: `Fill a 2D table. If characters match: <code>dp[i][j] = dp[i-1][j-1] + 1<\/code>. Else: <code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])<\/code>.`,
    init: { s1:'ABCBDAB', s2:'BDCAB' },
    run(params) {
      const { s1, s2 } = params || { s1:'ABCBDAB', s2:'BDCAB' };
      const m = s1.length, n = s2.length;
      const dp = Array.from({length:m+1}, () => Array(n+1).fill(0));
      const steps = [];
      steps.push({ dp:dp.map(r=>[...r]), i:0, j:0, s1, s2, note:`s1="${s1}" s2="${s2}". Fill dp table.`, type:'info' });
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (s1[i-1] === s2[j-1]) {
            dp[i][j] = dp[i-1][j-1] + 1;
            steps.push({ dp:dp.map(r=>[...r]), i, j, s1, s2, note:`s1[${i-1}]='${s1[i-1]}' == s2[${j-1}]='${s2[j-1]}' → match! dp[${i}][${j}]=dp[${i-1}][${j-1}]+1=${dp[i][j]}`, type:'success' });
          } else {
            dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            steps.push({ dp:dp.map(r=>[...r]), i, j, s1, s2, note:`'${s1[i-1]}'≠'${s2[j-1]}' → dp[${i}][${j}]=max(${dp[i-1][j]},${dp[i][j-1]})=${dp[i][j]}`, type:'info' });
          }
        }
      }
      steps[steps.length-1].done = true;
      return steps;
    },
    render(container, step, nums) {
      const p = nums || { s1:'ABCBDAB', s2:'BDCAB' };
      container.innerHTML = `<div class="dp-table-wrap" id="vDP"></div><div class="step-log" id="vLog" style="margin-top:16px;"></div>`;
    },
    update(step, params) {
      const { s1, s2 } = step;
      const dpWrap = document.getElementById('vDP');
      if (!dpWrap) return;
      let html = '<table class="dp-table"><tr><td class="dp-header"></td><td class="dp-header">ε</td>';
      for (let j = 0; j < s2.length; j++) html += `<td class="dp-header">${s2[j]}</td>`;
      html += '</tr>';
      for (let i = 0; i <= s1.length; i++) {
        html += `<tr><td class="dp-header">${i===0?'ε':s1[i-1]}</td>`;
        for (let j = 0; j <= s2.length; j++) {
          const isCur = i===step.i && j===step.j;
          const isFilled = step.dp[i][j] > 0 || (i > 0 && j > 0 && !isCur);
          html += `<td class="${isCur?'dp-cur':isFilled?'dp-filled':''}">${step.dp[i][j]}</td>`;
        }
        html += '</tr>';
      }
      html += '</table>';
      dpWrap.innerHTML = html;
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },

  inorder: {
    title: 'Inorder Traversal — Left → Root → Right',
    desc: `Visit left subtree recursively, then root, then right subtree. Inorder on a BST gives sorted output.`,
    init: null,
    run(params) {
      const tree = [1,2,3,4,5,null,6];
      const steps = [];
      const inorder = (i, depth) => {
        if (i >= tree.length || tree[i] === null) return;
        inorder(2*i+1, depth+1);
        steps.push({ visited: steps.map(s=>s.cur), cur:i, tree, note:`Visit node ${tree[i]} (idx ${i})`, type:'info' });
        inorder(2*i+2, depth+1);
      };
      inorder(0, 0);
      steps[steps.length-1].done = true;
      const visited = [];
      steps.forEach(s => { s.visitedSoFar = [...visited]; visited.push(s.cur); });
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `
        <div class="tree-wrap" id="vTree"></div>
        <div class="trackers" style="margin-top:12px;">
          <div class="tbox blue"><div class="tbox-label">inorder output</div><div class="tbox-val" id="tvOut" style="font-size:0.9rem;letter-spacing:2px;">—</div></div>
        </div>
        <div class="step-log" id="vLog" style="margin-top:12px;"></div>`;
    },
    update(step, params) {
      const tree = [1,2,3,4,5,null,6];
      renderTree('vTree', tree, step.cur, step.visitedSoFar || []);
      const out = [...(step.visitedSoFar||[]), step.cur].map(i => tree[i]).join(' → ');
      document.getElementById('tvOut').textContent = out || '—';
      addLogLine('vLog', step.note, step.done?'highlight':'info');
    }
  },

  setMatrixZeroes: {
    title: 'Set Matrix Zeroes',
    desc: `First pass: mark rows and columns that contain zeros. Second pass: zero out the marked rows and columns. O(1) extra space solution uses first row/col as markers.`,
    init: [[1,1,1],[1,0,1],[1,1,1]],
    run(matrix) {
      const m = matrix.map(r=>[...r]);
      const steps = [];
      const rows = new Set(), cols = new Set();
      steps.push({ matrix:m.map(r=>[...r]), phase:'scan', note:`Scan for zeros in matrix.`, type:'info', curR:-1, curC:-1 });
      for (let i=0; i<m.length; i++) for (let j=0; j<m[0].length; j++) {
        if (m[i][j]===0) { rows.add(i); cols.add(j);
          steps.push({ matrix:m.map(r=>[...r]), phase:'found', note:`Found 0 at (${i},${j}) → mark row ${i} and col ${j}`, type:'info', curR:i, curC:j });
        }
      }
      for (let i=0; i<m.length; i++) for (let j=0; j<m[0].length; j++) {
        if (rows.has(i)||cols.has(j)) { m[i][j]=0; }
      }
      steps.push({ matrix:m.map(r=>[...r]), phase:'done', note:`✦ Zeroed all marked rows(${[...rows].join(',')}) and cols(${[...cols].join(',')})`, type:'success', done:true, curR:-1, curC:-1 });
      return steps;
    },
    render(container, step, nums) {
      container.innerHTML = `<div id="vMat" style="display:flex;flex-direction:column;gap:4px;align-items:center;margin:8px 0;"></div><div class="step-log" id="vLog"></div>`;
    },
    update(step, nums) {
      const mat = document.getElementById('vMat');
      mat.innerHTML = step.matrix.map((row,i) =>
        `<div style="display:flex;gap:4px;">${row.map((v,j) => {
          const isZero = v===0;
          const isCur = i===step.curR && j===step.curC;
          return `<div class="cell" style="width:48px;height:48px;${isCur?'border-color:var(--orange);color:var(--orange);':''}${isZero&&!isCur?'color:var(--red);border-color:rgba(239,68,68,0.4);background:rgba(239,68,68,0.08);':''}"><span class="ci">${i},${j}</span>${v}</div>`;
        }).join('')}</div>`
      ).join('');
      addLogLine('vLog', step.note, step.type==='success'?'success':'info');
    }
  },
  pascalsTriangle:{
    title:"Pascal's Triangle",
    desc:"Each cell = sum of two cells above it. <code>C[i][j]=C[i-1][j-1]+C[i-1][j]<\/code>. Edges are always 1.",
    init:5,presets:[4,5,6],
    run(n){n=n||5;const tri=[[1]],steps=[{tri:[[1]],row:0,col:-1,note:"Row 0: [1]",type:"info"}];
      for(let i=1;i<n;i++){const prev=tri[i-1],row=[1];
        for(let j=1;j<i;j++){const v=prev[j-1]+prev[j];row.push(v);steps.push({tri:tri.map(r=>[...r]).concat([[...row]]),row:i,col:j,note:`${prev[j-1]}+${prev[j]}=${v}`,type:"info"});}
        row.push(1);tri.push(row);steps.push({tri:tri.map(r=>[...r]),row:i,col:-1,note:`Row ${i}: [${row}]`,type:"success"});}
      steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div id="vTri" style="display:flex;flex-direction:column;gap:5px;align-items:center;min-height:140px;margin:8px 0;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vTri").innerHTML=s.tri.map((row,i)=>`<div style="display:flex;gap:4px;">${row.map((v,j)=>`<div class="cell" style="width:38px;height:38px;font-size:0.78rem;${i===s.row&&j===s.col?"border-color:var(--accent);color:var(--accent-light);background:rgba(124,58,237,0.12);":i===s.row&&s.col===-1?"border-color:var(--green);color:var(--green-light);":""}">${v}</div>`).join("")}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  rotateMatrix:{
    title:"Rotate Matrix 90°",
    desc:"Step 1: Transpose — swap [i][j] with [j][i]. Step 2: Reverse each row. O(1) extra space.",
    init:[[1,2,3],[4,5,6],[7,8,9]],
    run(mat){const n=mat.length,m=mat.map(r=>[...r]),steps=[{m:m.map(r=>[...r]),note:"Start transpose.",type:"info",hi:-1,hj:-1}];
      for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){[m[i][j],m[j][i]]=[m[j][i],m[i][j]];steps.push({m:m.map(r=>[...r]),note:`Swap [${i}][${j}]↔[${j}][${i}]`,type:"info",hi:i,hj:j});}
      steps.push({m:m.map(r=>[...r]),note:"Transpose done. Reverse each row.",type:"info",hi:-1,hj:-1});
      for(let i=0;i<n;i++){m[i].reverse();steps.push({m:m.map(r=>[...r]),note:`Row ${i} reversed`,type:"success",hi:i,hj:-2});}
      steps[steps.length-1].done=true;steps[steps.length-1].note="✦ Rotated 90°!";return steps;},
    render(c){c.innerHTML=`<div id="vMat" style="display:flex;flex-direction:column;gap:4px;align-items:center;margin:8px 0;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vMat").innerHTML=s.m.map((row,i)=>`<div style="display:flex;gap:4px;">${row.map((v,j)=>`<div class="cell" style="width:48px;height:48px;${i===s.hi&&j===s.hj?"border-color:var(--orange);color:var(--orange);background:rgba(245,158,11,0.1);":i===s.hi&&s.hj===-2?"border-color:var(--green);color:var(--green-light);":""}">${v}</div>`).join("")}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  mergeIntervals:{
    title:"Merge Overlapping Intervals",
    desc:"Sort by start time. If current interval overlaps the last merged one, extend it. Otherwise add new.",
    init:[[1,3],[2,6],[8,10],[15,18]],
    run(intervals){const sorted=[...intervals].sort((a,b)=>a[0]-b[0]),merged=[],steps=[{intervals:sorted,merged:[],cur:-1,note:"Sorted by start.",type:"info"}];
      for(let i=0;i<sorted.length;i++){const[s,e]=sorted[i];if(!merged.length||merged[merged.length-1][1]<s){merged.push([s,e]);steps.push({intervals:sorted,merged:merged.map(m=>[...m]),cur:i,note:`[${s},${e}] no overlap → add`,type:"info"});}
        else{merged[merged.length-1][1]=Math.max(merged[merged.length-1][1],e);steps.push({intervals:sorted,merged:merged.map(m=>[...m]),cur:i,note:`[${s},${e}] overlaps → extend to ${merged[merged.length-1][1]}`,type:"success"});}}
      steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="viz-label">Input</div><div id="vI" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;"></div><div class="viz-label">Merged</div><div id="vM" style="display:flex;gap:6px;flex-wrap:wrap;min-height:40px;margin-bottom:10px;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vI").innerHTML=s.intervals.map((iv,i)=>`<div style="padding:5px 10px;border-radius:7px;border:2px solid ${i===s.cur?"var(--blue)":"var(--border2)"};font-family:var(--mono);font-size:0.75rem;color:${i===s.cur?"var(--blue-light)":"var(--text2)"};">[${iv}]</div>`).join("");document.getElementById("vM").innerHTML=s.merged.map(iv=>`<div style="padding:5px 10px;border-radius:7px;border:2px solid var(--green);font-family:var(--mono);font-size:0.75rem;color:var(--green-light);">[${iv}]</div>`).join("")||`<span style="font-family:var(--mono);font-size:0.72rem;color:var(--text3);">empty</span>`;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  mergeSortedArr:{
    title:"Merge Two Sorted Arrays",
    desc:"Two pointers — one per array. Always pick the smaller element and advance that pointer. O(n+m).",
    init:{a:[1,3,5,7],b:[2,4,6,8]},
    run(p){const{a,b}=p||{a:[1,3,5,7],b:[2,4,6,8]};let i=0,j=0;const result=[],steps=[{a,b,i,j,result:[],note:"Two pointers: i→A, j→B.",type:"info"}];
      while(i<a.length&&j<b.length){if(a[i]<=b[j]){result.push(a[i]);steps.push({a,b,i:i+1,j,result:[...result],note:`A[${i}]=${a[i]}≤B[${j}]=${b[j]} → pick ${a[i]}`,type:"info"});i++;}else{result.push(b[j]);steps.push({a,b,i,j:j+1,result:[...result],note:`B[${j}]=${b[j]}<A[${i}]=${a[i]} → pick ${b[j]}`,type:"info"});j++;}}
      while(i<a.length){result.push(a[i++]);}while(j<b.length){result.push(b[j++]);}
      steps.push({a,b,i,j,result:[...result],note:`✦ Merged: [${result}]`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="viz-label">Array A</div><div class="arr-wrap" id="vA"></div><div class="viz-label" style="margin-top:6px;">Array B</div><div class="arr-wrap" id="vB"></div><div class="viz-label" style="margin-top:6px;">Result</div><div class="arr-wrap" id="vR"></div><div class="step-log" id="vLog" style="margin-top:8px;"></div>`;},
    update(s){document.getElementById("vA").innerHTML=s.a.map((v,i)=>`<div class="cell ${i===s.i?"cur":i<s.i?"sorted":""}">${v}</div>`).join("");document.getElementById("vB").innerHTML=s.b.map((v,j)=>`<div class="cell ${j===s.j?"cur":j<s.j?"sorted":""}">${v}</div>`).join("");document.getElementById("vR").innerHTML=s.result.map(v=>`<div class="cell found" style="animation:none;">${v}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  findDuplicate:{
    title:"Find Duplicate — Floyd's Cycle",
    desc:"Treat values as pointers. Phase 1: slow×1, fast×2 until they meet. Phase 2: reset slow to start, move both ×1. Meeting point = duplicate.",
    init:[1,3,4,2,2],presets:[[1,3,4,2,2],[3,1,3,4,2]],
    run(nums){const steps=[];let slow=nums[0],fast=nums[0];steps.push({arr:nums,slow,fast,note:`Both start at nums[0]=${nums[0]}. Phase 1: detect loop.`,type:"info"});
      do{slow=nums[slow];fast=nums[nums[fast]];steps.push({arr:nums,slow,fast,note:`slow→${slow}, fast→${fast}${slow===fast?" ✦ MET!":""}`,type:slow===fast?"success":"info"});}while(slow!==fast);
      slow=nums[0];steps.push({arr:nums,slow,fast,note:`Phase 2: reset slow to start. Move both ×1.`,type:"info"});
      while(slow!==fast){slow=nums[slow];fast=nums[fast];steps.push({arr:nums,slow,fast,note:`slow→${slow}, fast→${fast}${slow===fast?` ✦ Duplicate=${slow}`:""}`,type:slow===fast?"success":"info"});}
      steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">slow</div><div class="tbox-val" id="tvS">—</div></div><div class="tbox pink"><div class="tbox-label">fast</div><div class="tbox-val" id="tvF">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map((v,i)=>`<div class="cell ${v===s.slow&&v===s.fast?"found":v===s.slow?"left":v===s.fast?"right":""}"><span class="ci">${i}</span>${v}</div>`).join("");document.getElementById("tvS").textContent=s.slow;document.getElementById("tvF").textContent=s.fast;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  repeatMissing:{
    title:"Repeat and Missing Number",
    desc:"Use sum formulas. Expected sum=n(n+1)/2, actual sum gives (A-B). Expected sum of squares gives (A+B). Solve for A,B.",
    init:[3,1,2,5,3],
    run(nums){const n=nums.length,S=nums.reduce((a,b)=>a+b,0),S2=nums.reduce((a,b)=>a+b*b,0),eS=n*(n+1)/2,eS2=n*(n+1)*(2*n+1)/6;
      const AB=S-eS,ApB=(S2-eS2)/AB,A=(AB+ApB)/2,B=ApB-A;
      const steps=[{arr:nums,note:`Array=[${nums}]. n=${n}`,type:"info",rv:null,mv:null},
        {arr:nums,note:`Sum=${S}, Expected=${eS}. A-B=${AB}`,type:"info",rv:null,mv:null},
        {arr:nums,note:`SumSq=${S2}, ExpectedSq=${eS2}. A+B=${ApB}`,type:"info",rv:null,mv:null},
        {arr:nums,note:`✦ Repeat(A)=${A}, Missing(B)=${B}`,type:"success",done:true,rv:A,mv:B}];
      return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="trackers"><div class="tbox pink"><div class="tbox-label">Repeat</div><div class="tbox-val" id="tvR">—</div></div><div class="tbox blue"><div class="tbox-label">Missing</div><div class="tbox-val" id="tvM">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map(v=>`<div class="cell ${v===s.rv?"found":""}" style="animation:none;">${v}</div>`).join("");if(s.rv!=null)document.getElementById("tvR").textContent=s.rv;if(s.mv!=null)document.getElementById("tvM").textContent=s.mv;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  countInversions:{
    title:"Count Inversions — Merge Sort",
    desc:"During merge: when we pick from right half, all remaining left elements form inversions. Count during merge step.",
    init:[5,4,3,2,1],presets:[[5,4,3,2,1],[2,4,1,3,5],[1,2,3,4,5]],
    run(nums){const arr=[...nums];let inv=0;const steps=[{arr:[...arr],note:`Count inversions in [${nums}].`,type:"info",inv}];
      const ms=(a,l,r)=>{if(l>=r)return;const m=Math.floor((l+r)/2);ms(a,l,m);ms(a,m+1,r);const L=a.slice(l,m+1),R=a.slice(m+1,r+1);let i=0,j=0,k=l;while(i<L.length&&j<R.length){if(L[i]<=R[j]){a[k++]=L[i++];}else{inv+=L.length-i;steps.push({arr:[...a],note:`${L[i]}>R[${j}]: +${L.length-i} inversions. Total=${inv}`,type:"success",inv});a[k++]=R[j++];}}while(i<L.length)a[k++]=L[i++];while(j<R.length)a[k++]=R[j++];steps.push({arr:[...a],note:`Merged [${l}..${r}]`,type:"info",inv});};
      ms(arr,0,arr.length-1);steps.push({arr:[...arr],note:`✦ Total inversions: ${inv}`,type:"success",done:true,inv});return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="trackers"><div class="tbox purple"><div class="tbox-label">Inversions</div><div class="tbox-val" id="tvInv">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map(v=>`<div class="cell">${v}</div>`).join("");document.getElementById("tvInv").textContent=s.inv;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  search2DMatrix:{
    title:"Search 2D Matrix — Top-Right Corner",
    desc:"Start at top-right. If target < current → move left. If target > current → move down. O(m+n).",
    init:{mat:[[1,3,5,7],[10,11,16,20],[23,30,34,60]],target:3},
    run(p){const{mat,target}=p||{mat:[[1,3,5,7],[10,11,16,20],[23,30,34,60]],target:3};const rows=mat.length,cols=mat[0].length;let r=0,c=cols-1;
      const steps=[{mat,r,c,target,found:false,note:`Start at top-right (0,${cols-1})=${mat[0][cols-1]}. Target=${target}`,type:"info"}];
      while(r<rows&&c>=0){if(mat[r][c]===target){steps.push({mat,r,c,target,found:true,note:`✦ Found ${target} at (${r},${c})!`,type:"success",done:true});return steps;}
        else if(mat[r][c]>target){steps.push({mat,r,c:c-1,target,found:false,note:`${mat[r][c]}>${target} → move left`,type:"info"});c--;}
        else{steps.push({mat,r:r+1,c,target,found:false,note:`${mat[r][c]}<${target} → move down`,type:"info"});r++;}}
      steps.push({mat,r,c,target,found:false,note:"Not found.",type:"info",done:true});return steps;},
    render(c){c.innerHTML=`<div id="vMat" style="display:flex;flex-direction:column;gap:4px;align-items:center;margin:8px 0;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vMat").innerHTML=s.mat.map((row,i)=>`<div style="display:flex;gap:4px;">${row.map((v,j)=>`<div class="cell" style="width:46px;height:46px;${i===s.r&&j===s.c?s.found?"border-color:var(--green);color:var(--green-light);background:rgba(16,185,129,0.12);":"border-color:var(--blue);color:var(--blue-light);background:rgba(59,130,246,0.1);":""}">${v}</div>`).join("")}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  floorCeil:{
    title:"Floor & Ceil in Sorted Array",
    desc:"Binary search variant. Floor = largest element ≤ target. Ceil = smallest element ≥ target. Track candidates as we narrow.",
    init:[1,2,8,10,11,12,19],
    run(nums){const target=5;let lo=0,hi=nums.length-1,floor=-1,ceil=-1;
      const steps=[{arr:nums,lo,hi,mid:-1,floor,ceil,note:`Find floor/ceil of ${target} in sorted array.`,type:"info"}];
      while(lo<=hi){const mid=Math.floor((lo+hi)/2);if(nums[mid]===target){steps.push({arr:nums,lo,hi,mid,floor:nums[mid],ceil:nums[mid],note:`Exact match! floor=ceil=${target}`,type:"success",done:true});return steps;}
        else if(nums[mid]<target){floor=nums[mid];steps.push({arr:nums,lo:mid+1,hi,mid,floor,ceil,note:`${nums[mid]}<${target} → floor candidate=${nums[mid]}, go right`,type:"info"});lo=mid+1;}
        else{ceil=nums[mid];steps.push({arr:nums,lo,hi:mid-1,mid,floor,ceil,note:`${nums[mid]}>${target} → ceil candidate=${nums[mid]}, go left`,type:"info"});hi=mid-1;}}
      steps.push({arr:nums,lo,hi,mid:-1,floor,ceil,note:`✦ Floor=${floor}, Ceil=${ceil} for target=${target}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Floor</div><div class="tbox-val" id="tvF">?</div></div><div class="tbox blue"><div class="tbox-label">Ceil</div><div class="tbox-val" id="tvC">?</div></div><div class="tbox orange"><div class="tbox-label">Target</div><div class="tbox-val">5</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map((v,i)=>`<div class="cell ${i===s.mid?"cur":i<s.lo||i>s.hi?"sorted":""}">${v}</div>`).join("");document.getElementById("tvF").textContent=s.floor===-1?"?":s.floor;document.getElementById("tvC").textContent=s.ceil===-1?"?":s.ceil;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  nthRoot:{
    title:"Find Nth Root — Binary Search",
    desc:"Binary search on [1, num]. For mid, compute mid^n and compare. Narrow the search space each step.",
    init:{n:3,num:27},presets:[{n:3,num:27},{n:2,num:16},{n:4,num:81}],
    run(p){const{n,num}=p||{n:3,num:27};let lo=1,hi=num;
      const steps=[{lo,hi,mid:-1,note:`Find ${n}th root of ${num}. Search [1,${num}]`,type:"info"}];
      while(lo<=hi){const mid=Math.floor((lo+hi)/2),pw=Math.pow(mid,n);if(pw===num){steps.push({lo,hi,mid,note:`✦ ${mid}^${n}=${pw}. Answer=${mid}!`,type:"success",done:true});return steps;}
        else if(pw<num){steps.push({lo:mid+1,hi,mid,note:`${mid}^${n}=${pw}<${num} → go right`,type:"info"});lo=mid+1;}
        else{steps.push({lo,hi:mid-1,mid,note:`${mid}^${n}=${pw}>${num} → go left`,type:"info"});hi=mid-1;}}
      steps.push({lo,hi,mid:-1,note:"Not a perfect root.",type:"info",done:true});return steps;},
    render(c){c.innerHTML=`<div class="trackers"><div class="tbox green"><div class="tbox-label">lo</div><div class="tbox-val" id="tvLo">1</div></div><div class="tbox blue"><div class="tbox-label">mid</div><div class="tbox-val" id="tvMid">—</div></div><div class="tbox pink"><div class="tbox-label">hi</div><div class="tbox-val" id="tvHi">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("tvLo").textContent=s.lo;document.getElementById("tvMid").textContent=s.mid>=0?s.mid:"—";document.getElementById("tvHi").textContent=s.hi;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },


  peakElement:{
    title:"Find Peak Element",
    desc:"Peak = element greater than both neighbors. Binary search: if arr[mid] < arr[mid+1], peak is in right half. Otherwise, left half.",
    init:[1,2,1,3,5,6,4],presets:[[1,2,1,3,5,6,4],[1,2,3,1],[3,4,3,2,1]],
    run(nums){let lo=0,hi=nums.length-1;const steps=[{arr:nums,lo,hi,mid:-1,note:`Find peak in [${nums}]`,type:"info"}];
      while(lo<=hi){const mid=Math.floor((lo+hi)/2);const iL=mid>0&&nums[mid-1]>nums[mid],iR=mid<nums.length-1&&nums[mid+1]>nums[mid];
        if(!iL&&!iR){steps.push({arr:nums,lo,hi,mid,note:`✦ Peak at idx ${mid} (val ${nums[mid]})!`,type:"success",done:true});return steps;}
        else if(iR){steps.push({arr:nums,lo:mid+1,hi,mid,note:`arr[mid+1]=${nums[mid+1]}>arr[mid]=${nums[mid]} → peak in right`,type:"info"});lo=mid+1;}
        else{steps.push({arr:nums,lo,hi:mid-1,mid,note:`arr[mid-1]=${nums[mid-1]}>arr[mid]=${nums[mid]} → peak in left`,type:"info"});hi=mid-1;}}
      return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map((v,i)=>`<div class="cell ${i===s.mid?s.done?"found":"cur":i<s.lo||i>s.hi?"sorted":""}">${v}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  rotatedSearch:{
    title:"Search in Rotated Sorted Array",
    desc:"One half is always sorted. Check which half, then check if target lies within that half. Narrow accordingly.",
    init:[4,5,6,7,0,1,2],presets:[[4,5,6,7,0,1,2],[4,5,6,7,0,1,2]],
    run(nums,target=0){let lo=0,hi=nums.length-1;const steps=[{arr:nums,lo,hi,mid:-1,target,note:`Find ${target} in rotated array.`,type:"info"}];
      while(lo<=hi){const mid=Math.floor((lo+hi)/2);if(nums[mid]===target){steps.push({arr:nums,lo,hi,mid,target,note:`✦ Found ${target} at idx ${mid}!`,type:"success",done:true});return steps;}
        if(nums[lo]<=nums[mid]){if(nums[lo]<=target&&target<nums[mid]){steps.push({arr:nums,lo,hi:mid-1,mid,target,note:`Left half sorted; target in left.`,type:"info"});hi=mid-1;}else{steps.push({arr:nums,lo:mid+1,hi,mid,target,note:`Left half sorted; target not in it → go right.`,type:"info"});lo=mid+1;}}
        else{if(nums[mid]<target&&target<=nums[hi]){steps.push({arr:nums,lo:mid+1,hi,mid,target,note:`Right half sorted; target in right.`,type:"info"});lo=mid+1;}else{steps.push({arr:nums,lo,hi:mid-1,mid,target,note:`Right half sorted; target not in it → go left.`,type:"info"});hi=mid-1;}}}
      steps.push({arr:nums,lo,hi,mid:-1,target,note:"Not found.",type:"info",done:true});return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="trackers"><div class="tbox purple"><div class="tbox-label">Target</div><div class="tbox-val">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map((v,i)=>`<div class="cell ${i===s.mid?s.done&&s.arr[s.mid]===s.target?"found":"cur":i<s.lo||i>s.hi?"sorted":""}">${v}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  reverseWords:{
    title:"Reverse Words in a String",
    desc:"Trim → split on whitespace → reverse word array → join with single space. Handles multiple spaces.",
    init:"  the sky  is blue  ",presets:["  the sky  is blue  ","hello world","a good   example"],
    run(str){const steps=[{words:[],result:"",note:`Input: "${str}"`,type:"info",str}];const words=str.trim().split(/\s+/);
      steps.push({words:[...words],result:"",note:`Split+trim: [${words.map(w=>`"${w}"`)}]`,type:"info",str});
      const rev=[...words].reverse();steps.push({words:rev,result:"",note:`Reversed: [${rev.map(w=>`"${w}"`)}]`,type:"info",str});
      const result=rev.join(" ");steps.push({words:rev,result,note:`✦ Output: "${result}"`,type:"success",done:true,str});return steps;},
    render(c){c.innerHTML=`<div id="vStr" style="font-family:var(--mono);font-size:0.8rem;padding:12px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);margin-bottom:12px;"></div><div style="display:flex;gap:6px;flex-wrap:wrap;" id="vW"></div><div class="step-log" id="vLog" style="margin-top:10px;"></div>`;},
    update(s){document.getElementById("vStr").innerHTML=`<span style="color:var(--text3);">in: </span><span style="color:var(--accent-light);">"${s.str}"</span>${s.result?`<br><span style="color:var(--text3);">out: </span><span style="color:var(--green-light);">"${s.result}"</span>`:""}`;document.getElementById("vW").innerHTML=s.words.map(w=>`<div style="padding:5px 10px;border-radius:7px;border:1px solid var(--border2);background:var(--surface2);font-family:var(--mono);font-size:0.78rem;color:var(--blue-light);">${w}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  longestPalin:{
    title:"Longest Palindromic Substring",
    desc:"Expand around center for each char. Try odd (single center) and even (two centers). Track longest found.",
    init:"babad",presets:["babad","cbbd","racecar","abcba"],
    run(str){const steps=[{str,l:-1,r:-1,best:"",note:`Find longest palindrome in "${str}"`,type:"info"}];let best="";
      const exp=(l,r)=>{while(l>=0&&r<str.length&&str[l]===str[r]){steps.push({str,l,r,best,note:`'${str[l]}'='${str[r]}' expand → "${str.slice(l,r+1)}"`,type:"info"});l--;r++;}const f=str.slice(l+1,r);if(f.length>best.length){best=f;steps.push({str,l:l+1,r:r-1,best,note:`New best: "${best}"`,type:"success"});}};
      for(let i=0;i<str.length;i++){exp(i,i);exp(i,i+1);}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Longest palindrome: "${best}"`;return steps;},
    render(c){c.innerHTML=`<div style="display:flex;gap:4px;justify-content:center;margin:8px 0;" id="vCh"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Best</div><div class="tbox-val" id="tvB" style="font-size:1rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vCh").innerHTML=s.str.split("").map((c,i)=>`<div class="cell ${i>=s.l&&i<=s.r?"cur":""}" style="width:42px;height:42px;">${c}</div>`).join("");document.getElementById("tvB").textContent=s.best||"—";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  romanToInt:{
    title:"Roman to Integer",
    desc:"Scan right-to-left. If current value < previous, subtract it (IV=4). Otherwise add it (VI=6).",
    init:"MCMXCIV",presets:["MCMXCIV","LVIII","IX","XIV"],
    run(str){const map={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let result=0,prev=0;
      const steps=[{str,i:-1,result,note:`Parse "${str}" right-to-left`,type:"info"}];
      for(let i=str.length-1;i>=0;i--){const cur=map[str[i]];if(cur<prev){result-=cur;steps.push({str,i,result,note:`${str[i]}(${cur})<prev(${prev}) → subtract. result=${result}`,type:"info"});}else{result+=cur;steps.push({str,i,result,note:`${str[i]}(${cur})≥prev(${prev}) → add. result=${result}`,type:"info"});}prev=cur;}
      steps.push({str,i:-1,result,note:`✦ "${str}" = ${result}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div style="display:flex;gap:4px;justify-content:center;margin:8px 0;" id="vCh"></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">Result</div><div class="tbox-val" id="tvR">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vCh").innerHTML=s.str.split("").map((c,i)=>`<div class="cell ${i===s.i?"cur":i>s.i?"sorted":""}" style="width:42px;height:42px;">${c}</div>`).join("");document.getElementById("tvR").textContent=s.result;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  atoi:{
    title:"Implement ATOI",
    desc:"Skip whitespace → read sign → parse digits → clamp to INT32 range. Character-by-character processing.",
    init:"  -42",presets:["  -42","4193 with words","-91283472332"],
    run(str){let i=0,sign=1,result=0;const steps=[{str,i,sign,result,note:`Parse "${str}"`,type:"info"}];
      while(i<str.length&&str[i]===" ")i++;steps.push({str,i,sign,result,note:`Skip whitespace. i=${i}`,type:"info"});
      if(i<str.length&&(str[i]==="+"||str[i]==="-")){sign=str[i]==="-"?-1:1;steps.push({str,i:i+1,sign,result,note:`Sign '${str[i]}' → sign=${sign}`,type:"info"});i++;}
      while(i<str.length&&str[i]>="0"&&str[i]<="9"){result=Math.min(result*10+parseInt(str[i]),2147483647);steps.push({str,i,sign,result,note:`Digit '${str[i]}': result=${result}`,type:"info"});i++;}
      steps.push({str,i,sign,result:sign*result,note:`✦ Result: ${sign*result}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:8px 0;" id="vCh"></div><div class="trackers"><div class="tbox pink"><div class="tbox-label">Sign</div><div class="tbox-val" id="tvSg">+</div></div><div class="tbox blue"><div class="tbox-label">Result</div><div class="tbox-val" id="tvR">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vCh").innerHTML=s.str.split("").map((c,i)=>`<div class="cell ${i===s.i?"cur":i<s.i?"sorted":""}" style="width:38px;height:38px;font-size:0.9rem;">${c===" "?"_":c}</div>`).join("");document.getElementById("tvSg").textContent=s.sign===1?"+":"−";document.getElementById("tvR").textContent=s.result;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  longestPrefix:{
    title:"Longest Common Prefix",
    desc:"Use first string as reference. At each column, check if all strings match. Stop on mismatch.",
    init:["flower","flow","flight"],presets:[["flower","flow","flight"],["dog","racecar","car"],["ab","a","abc"]],
    run(strs){let prefix="";const steps=[{strs,prefix,col:-1,note:`Find LCP of [${strs.map(s=>`"${s}"`)}]`,type:"info"}];
      for(let col=0;col<strs[0].length;col++){const ch=strs[0][col];
        for(let i=1;i<strs.length;i++){if(col>=strs[i].length||strs[i][col]!==ch){steps.push({strs,prefix,col,note:`Mismatch at col ${col}: '${ch}' vs '${strs[i][col]||"end"}'`,type:"info",done:true});steps[steps.length-1].note=`✦ LCP="${prefix}"`;steps[steps.length-1].type="success";return steps;}}
        prefix+=ch;steps.push({strs,prefix,col,note:`Col ${col}: '${ch}' matches all. prefix="${prefix}"`,type:"info"});}
      steps.push({strs,prefix,col:strs[0].length,note:`✦ LCP="${prefix}"`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div id="vSt" style="display:flex;flex-direction:column;gap:6px;align-items:center;margin:8px 0;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Common Prefix</div><div class="tbox-val" id="tvP" style="font-size:1rem;">""</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vSt").innerHTML=s.strs.map(str=>`<div style="display:flex;gap:4px;">${str.split("").map((c,i)=>`<div class="cell ${i<s.prefix.length?"found":i===s.col?"cur":""}" style="width:36px;height:36px;font-size:0.82rem;animation:none;">${c}</div>`).join("")}</div>`).join("");document.getElementById("tvP").textContent=`"${s.prefix}"`;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  mergeSortedLL:{
    title:"Merge Two Sorted Linked Lists",
    desc:"Two pointers. Pick smaller head, advance that pointer. Append remaining tail at the end. O(n+m).",
    init:{a:[1,2,4],b:[1,3,4]},
    run(p){const{a,b}=p||{a:[1,2,4],b:[1,3,4]};let i=0,j=0;const result=[],steps=[{a,b,i,j,result:[],note:`Merge [${a.join("→")}] and [${b.join("→")}]`,type:"info"}];
      while(i<a.length&&j<b.length){if(a[i]<=b[j]){result.push(a[i]);steps.push({a,b,i:i+1,j,result:[...result],note:`${a[i]}≤${b[j]} → pick A[${i}]`,type:"info"});i++;}else{result.push(b[j]);steps.push({a,b,i,j:j+1,result:[...result],note:`${b[j]}<${a[i]} → pick B[${j}]`,type:"info"});j++;}}
      while(i<a.length){result.push(a[i++]);}while(j<b.length){result.push(b[j++]);}
      steps.push({a,b,i,j,result:[...result],note:`✦ Merged: ${result.join("→")}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="viz-label">List A</div><div class="ll-wrap" id="vA"></div><div class="viz-label">List B</div><div class="ll-wrap" id="vB"></div><div class="viz-label">Result</div><div class="ll-wrap" id="vR"></div><div class="step-log" id="vLog"></div>`;},
    update(s){const ll=(id,arr,active)=>document.getElementById(id).innerHTML=arr.map((v,k)=>`<div class="ll-node"><div class="ll-box ${k===active?"cur":k<active?"slow-p":""}">${v}</div></div>${k<arr.length-1?'<span class="ll-arrow">→</span>':""}`).join("");ll("vA",s.a,s.i);ll("vB",s.b,s.j);document.getElementById("vR").innerHTML=s.result.map((v,k)=>`<div class="ll-node"><div class="ll-box fast-p">${v}</div></div>${k<s.result.length-1?'<span class="ll-arrow">→</span>':""}`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  removeNthLL:{
    title:"Remove Nth Node From End",
    desc:"Advance fast pointer N steps ahead. Move both until fast reaches the end. Slow.next is the node to remove.",
    init:{nodes:[1,2,3,4,5],n:2},
    run(p){const{nodes,n}=p||{nodes:[1,2,3,4,5],n:2};let fast=0,slow=0;const steps=[{nodes,slow,fast,note:`Remove ${n}th from end. Advance fast by ${n}.`,type:"info"}];
      for(let k=0;k<n;k++){fast++;steps.push({nodes,slow,fast,note:`fast → idx ${fast} (val ${nodes[fast]??'end'})`,type:"info"});}
      while(fast<nodes.length-1){slow++;fast++;steps.push({nodes,slow,fast,note:`Both advance: slow=${nodes[slow]}, fast=${nodes[fast]}`,type:"info"});}
      const removed=nodes[slow+1],result=[...nodes.slice(0,slow+1),...nodes.slice(slow+2)];
      steps.push({nodes:result,slow,fast,note:`✦ Removed ${removed}. List: ${result.join("→")}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="ll-wrap" id="vLL"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">slow</div><div class="tbox-val" id="tvS">—</div></div><div class="tbox pink"><div class="tbox-label">fast</div><div class="tbox-val" id="tvF">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vLL").innerHTML=s.nodes.map((v,i)=>`<div class="ll-node"><div class="ll-box ${i===s.slow?"slow-p":i===s.fast?"fast-p":""}">${v}</div></div>${i<s.nodes.length-1?'<span class="ll-arrow">→</span>':""}`).join("");document.getElementById("tvS").textContent=s.nodes[s.slow]??"—";document.getElementById("tvF").textContent=s.nodes[s.fast]??"end";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  deleteMiddleLL:{
    title:"Delete Middle of Linked List",
    desc:"Slow+fast pointers. When fast reaches end, slow is at middle. Remove slow.next to delete the middle node.",
    init:[1,3,4,7,1,2,6],
    run(nums){const steps=[{nodes:nums,slow:0,fast:0,note:"Find middle with slow/fast pointers.",type:"info"}];let slow=0,fast=0;
      while(fast<nums.length-2){fast+=2;slow++;steps.push({nodes:nums,slow,fast:Math.min(fast,nums.length-1),note:`slow=${nums[slow]}, fast=${nums[Math.min(fast,nums.length-1)]}`,type:"info"});}
      const mid=slow+1,result=[...nums.slice(0,mid),...nums.slice(mid+1)];
      steps.push({nodes:result,slow,fast,note:`✦ Deleted middle node (${nums[mid]}). List: ${result.join("→")}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="ll-wrap" id="vLL"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vLL").innerHTML=s.nodes.map((v,i)=>`<div class="ll-node"><div class="ll-box ${i===s.slow?"slow-p":i===s.fast?"fast-p":""}">${v}</div></div>${i<s.nodes.length-1?'<span class="ll-arrow">→</span>':""}`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },


  sortLL:{
    title:"Sort Linked List — Merge Sort",
    desc:"Find middle → split → recursively sort halves → merge. O(n log n) time, O(log n) space.",
    init:[4,2,1,3],
    run(nums){const arr=[...nums],steps=[{arr:[...arr],note:`Sort [${nums}] via merge sort.`,type:"info"}];
      const ms=(a)=>{if(a.length<=1)return a;const mid=Math.floor(a.length/2);const L=ms(a.slice(0,mid)),R=ms(a.slice(mid));const merged=[];let i=0,j=0;while(i<L.length&&j<R.length)merged.push(L[i]<=R[j]?L[i++]:R[j++]);merged.push(...L.slice(i),...R.slice(j));steps.push({arr:[...merged],note:`Merged: [${merged}]`,type:"info"});return merged;};
      const sorted=ms(arr);steps.push({arr:[...sorted],note:`✦ Sorted: ${sorted.join("→")}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="ll-wrap" id="vLL"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vLL").innerHTML=s.arr.map((v,i)=>`<div class="ll-node"><div class="ll-box">${v}</div></div>${i<s.arr.length-1?'<span class="ll-arrow">→</span>':""}`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  oddEvenLL:{
    title:"Odd Even Linked List",
    desc:"Group odd-indexed nodes together, then even-indexed. Connect odd-tail → even-head. O(n) time, O(1) space.",
    init:[1,2,3,4,5],
    run(nums){const steps=[{nodes:nums,odd:[],even:[],note:"Separate odd/even indexed nodes.",type:"info"}];const odd=[],even=[];
      for(let i=0;i<nums.length;i++){if(i%2===0)odd.push(nums[i]);else even.push(nums[i]);steps.push({nodes:nums,odd:[...odd],even:[...even],note:`Node ${i+1}(val ${nums[i]}) → ${i%2===0?"odd":"even"} group`,type:"info"});}
      const result=[...odd,...even];steps.push({nodes:result,odd,even,note:`✦ Result: ${result.join("→")}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="viz-label">Odd group</div><div class="ll-wrap" id="vOdd"></div><div class="viz-label">Even group</div><div class="ll-wrap" id="vEven"></div><div class="step-log" id="vLog"></div>`;},
    update(s){const ll=(id,arr,cls)=>document.getElementById(id).innerHTML=arr.map((v,i)=>`<div class="ll-node"><div class="ll-box ${cls}">${v}</div></div>${i<arr.length-1?'<span class="ll-arrow">→</span>':""}`).join("");ll("vOdd",s.odd,"slow-p");ll("vEven",s.even,"fast-p");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  subsetSum:{
    title:"Subset Sum — Backtracking",
    desc:"At each step: include or exclude the current element. Explore all 2^n combinations via DFS backtracking.",
    init:[1,2,3],presets:[[1,2,3],[1,2,2]],
    run(nums){const steps=[],results=[];
      const bt=(i,curr)=>{if(i===nums.length){results.push([...curr]);steps.push({subsets:results.map(r=>[...r]),curr:[...curr],note:`✦ Subset: [${curr.join(",")||"∅"}] (sum=${curr.reduce((a,b)=>a+b,0)})`,type:"success"});return;}
        curr.push(nums[i]);steps.push({subsets:results.map(r=>[...r]),curr:[...curr],note:`Include ${nums[i]}: path=[${curr}]`,type:"info"});bt(i+1,curr);curr.pop();
        steps.push({subsets:results.map(r=>[...r]),curr:[...curr],note:`Exclude ${nums[i]}: path=[${curr.join(",")||"∅"}]`,type:"info"});bt(i+1,curr);};
      bt(0,[]);steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="trackers"><div class="tbox blue"><div class="tbox-label">Current Path</div><div class="tbox-val" id="tvP" style="font-size:0.9rem;">[]</div></div><div class="tbox green"><div class="tbox-label">Subsets Found</div><div class="tbox-val" id="tvC">0</div></div></div><div id="vSub" style="display:flex;gap:5px;flex-wrap:wrap;margin:10px 0;min-height:36px;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("tvP").textContent=`[${s.curr.join(",")}]`;document.getElementById("tvC").textContent=s.subsets.length;document.getElementById("vSub").innerHTML=s.subsets.map(sub=>`<div style="padding:3px 8px;border-radius:5px;border:1px solid var(--green);color:var(--green-light);font-family:var(--mono);font-size:0.7rem;">[${sub.join(",")||"∅"}]</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  subsetSumII:{
    title:"Unique Subsets (No Duplicates)",
    desc:"Sort first to group duplicates. At the same recursion level, skip duplicate elements to avoid duplicate subsets.",
    init:[1,2,2],presets:[[1,2,2],[1,1,2]],
    run(nums){const sorted=[...nums].sort((a,b)=>a-b),steps=[{subsets:[],curr:[],note:`Sorted: [${sorted}]. Skip dups at same level.`,type:"info"}],results=[];
      const bt=(start,curr)=>{results.push([...curr]);steps.push({subsets:results.map(r=>[...r]),curr:[...curr],note:`Add: [${curr.join(",")||"∅"}]`,type:"success"});
        for(let i=start;i<sorted.length;i++){if(i>start&&sorted[i]===sorted[i-1]){steps.push({subsets:results.map(r=>[...r]),curr:[...curr],note:`Skip dup ${sorted[i]} at pos ${i}`,type:"info"});continue;}
          curr.push(sorted[i]);steps.push({subsets:results.map(r=>[...r]),curr:[...curr],note:`Include ${sorted[i]}: [${curr}]`,type:"info"});bt(i+1,curr);curr.pop();}};
      bt(0,[]);steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="trackers"><div class="tbox blue"><div class="tbox-label">Path</div><div class="tbox-val" id="tvP" style="font-size:0.9rem;">[]</div></div><div class="tbox green"><div class="tbox-label">Unique Subsets</div><div class="tbox-val" id="tvC">0</div></div></div><div id="vSub" style="display:flex;gap:5px;flex-wrap:wrap;margin:10px 0;min-height:36px;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("tvP").textContent=`[${s.curr.join(",")}]`;document.getElementById("tvC").textContent=s.subsets.length;document.getElementById("vSub").innerHTML=s.subsets.map(sub=>`<div style="padding:3px 8px;border-radius:5px;border:1px solid var(--green);color:var(--green-light);font-family:var(--mono);font-size:0.7rem;">[${sub.join(",")||"∅"}]</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  combinationSum:{
    title:"Combination Sum — Backtracking",
    desc:"Same element can be reused. Try all candidates ≥ start index. Prune when remaining becomes negative.",
    init:{candidates:[2,3,6,7],target:7},
    run(p){const{candidates,target}=p||{candidates:[2,3,6,7],target:7};const steps=[],results=[];
      const bt=(start,curr,rem)=>{if(rem===0){results.push([...curr]);steps.push({results:results.map(r=>[...r]),curr:[...curr],note:`✦ [${curr}] sums to ${target}`,type:"success"});return;}
        for(let i=start;i<candidates.length;i++){if(candidates[i]>rem){steps.push({results:results.map(r=>[...r]),curr:[...curr],note:`${candidates[i]}>rem(${rem}), prune`,type:"info"});break;}
          curr.push(candidates[i]);steps.push({results:results.map(r=>[...r]),curr:[...curr],note:`Try ${candidates[i]}: [${curr}] rem=${rem-candidates[i]}`,type:"info"});bt(i,curr,rem-candidates[i]);curr.pop();}};
      bt(0,[],target);steps.push({results:results.map(r=>[...r]),curr:[],note:`Done. ${results.length} combinations.`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="trackers"><div class="tbox blue"><div class="tbox-label">Current</div><div class="tbox-val" id="tvP" style="font-size:0.85rem;">[]</div></div><div class="tbox orange"><div class="tbox-label">Target</div><div class="tbox-val">7</div></div><div class="tbox green"><div class="tbox-label">Found</div><div class="tbox-val" id="tvC">0</div></div></div><div id="vRes" style="display:flex;gap:5px;flex-wrap:wrap;margin:10px 0;min-height:36px;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("tvP").textContent=`[${s.curr.join(",")}]`;document.getElementById("tvC").textContent=s.results.length;document.getElementById("vRes").innerHTML=s.results.map(r=>`<div style="padding:3px 8px;border-radius:5px;border:1px solid var(--green);color:var(--green-light);font-family:var(--mono);font-size:0.7rem;">[${r.join(",")}]</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  permutations:{
    title:"Permutations of Array",
    desc:"Swap current element with each subsequent element, recurse, then swap back. Generates all n! permutations in-place.",
    init:[1,2,3],
    run(nums){const arr=[...nums],steps=[],results=[];
      const bt=(start)=>{if(start===arr.length){results.push([...arr]);steps.push({arr:[...arr],results:results.map(r=>[...r]),note:`✦ Permutation: [${arr}]`,type:"success"});return;}
        for(let i=start;i<arr.length;i++){[arr[start],arr[i]]=[arr[i],arr[start]];steps.push({arr:[...arr],results:results.map(r=>[...r]),note:`Swap idx ${start}↔${i}: [${arr}]`,type:"info"});bt(start+1);[arr[start],arr[i]]=[arr[i],arr[start]];}};
      bt(0);steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Permutations</div><div class="tbox-val" id="tvC">0</div></div></div><div id="vRes" style="display:flex;gap:5px;flex-wrap:wrap;margin:10px 0;min-height:36px;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map(v=>`<div class="cell">${v}</div>`).join("");document.getElementById("tvC").textContent=s.results.length;document.getElementById("vRes").innerHTML=s.results.map(r=>`<div style="padding:3px 8px;border-radius:5px;border:1px solid var(--accent);color:var(--accent-light);font-family:var(--mono);font-size:0.7rem;">[${r.join(",")}]</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  preorder:{
    title:"Preorder Traversal — Root→Left→Right",
    desc:"Visit root first, then recurse left subtree, then right. Used for copying/serializing trees.",
    init:null,
    run(){const tree=[1,2,3,4,5,null,6];const steps=[],visited=[];
      const pre=(i)=>{if(i>=tree.length||tree[i]===null)return;steps.push({cur:i,tree,visitedSoFar:[...visited],note:`Visit node ${tree[i]}`,type:"info"});visited.push(i);pre(2*i+1);pre(2*i+2);};
      pre(0);steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">preorder output</div><div class="tbox-val" id="tvOut" style="font-size:0.85rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[1,2,3,4,5,null,6];renderTree("vTree",tree,s.cur,s.visitedSoFar||[]);document.getElementById("tvOut").textContent=[...(s.visitedSoFar||[]),s.cur].map(i=>tree[i]).join(" → ");addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },

  postorder:{
    title:"Postorder Traversal — Left→Right→Root",
    desc:"Recurse left, then right, then visit root. Used for deleting trees and expression tree evaluation.",
    init:null,
    run(){const tree=[1,2,3,4,5,null,6];const steps=[],visited=[];
      const post=(i)=>{if(i>=tree.length||tree[i]===null)return;post(2*i+1);post(2*i+2);steps.push({cur:i,tree,visitedSoFar:[...visited],note:`Visit node ${tree[i]}`,type:"info"});visited.push(i);};
      post(0);steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">postorder output</div><div class="tbox-val" id="tvOut" style="font-size:0.85rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[1,2,3,4,5,null,6];renderTree("vTree",tree,s.cur,s.visitedSoFar||[]);document.getElementById("tvOut").textContent=[...(s.visitedSoFar||[]),s.cur].map(i=>tree[i]).join(" → ");addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },

  levelOrder:{
    title:"Level Order Traversal — BFS",
    desc:"Use a queue. Enqueue root, then for each dequeued node, enqueue its children. Processes level by level.",
    init:null,
    run(){const tree=[3,9,20,null,null,15,7];const steps=[],visited=[],queue=[0];
      steps.push({cur:-1,tree,visitedSoFar:[],queue:[...queue],note:`Enqueue root (${tree[0]})`,type:"info"});
      while(queue.length){const i=queue.shift();if(i>=tree.length||tree[i]===null)continue;steps.push({cur:i,tree,visitedSoFar:[...visited],queue:[...queue],note:`Dequeue ${tree[i]}, enqueue children`,type:"info"});visited.push(i);if(2*i+1<tree.length&&tree[2*i+1]!==null)queue.push(2*i+1);if(2*i+2<tree.length&&tree[2*i+2]!==null)queue.push(2*i+2);}
      steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox orange"><div class="tbox-label">Queue</div><div class="tbox-val" id="tvQ" style="font-size:0.8rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[3,9,20,null,null,15,7];renderTree("vTree",tree,s.cur,s.visitedSoFar||[]);document.getElementById("tvQ").textContent=s.queue?s.queue.map(i=>tree[i]).join(", "):"—";addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },

  treeHeight:{
    title:"Height of Binary Tree",
    desc:"height(node) = 1 + max(height(left), height(right)). Base case: null returns 0. Post-order traversal.",
    init:null,
    run(){const tree=[3,9,20,null,null,15,7];const steps=[],heights={};
      const h=(i)=>{if(i>=tree.length||tree[i]===null)return 0;const l=h(2*i+1),r=h(2*i+2);heights[i]=1+Math.max(l,r);steps.push({tree,cur:i,heights:{...heights},note:`height(${tree[i]})=1+max(${l},${r})=${heights[i]}`,type:"info"});return heights[i];};
      h(0);steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Tree height = ${heights[0]}`;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">Height</div><div class="tbox-val" id="tvH">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[3,9,20,null,null,15,7];renderTree("vTree",tree,s.cur,[]);document.getElementById("tvH").textContent=s.heights[0]||"—";addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },


  treeDiameter:{
    title:"Diameter of Binary Tree",
    desc:"At each node: through-diameter = leftHeight + rightHeight. Update global max bottom-up. O(n) single pass.",
    init:null,
    run(){const tree=[1,2,3,4,5];const steps=[];let maxD=0;
      const dfs=(i)=>{if(i>=tree.length||tree[i]===null)return 0;const l=dfs(2*i+1),r=dfs(2*i+2);const d=l+r;if(d>maxD)maxD=d;steps.push({tree,cur:i,maxD,note:`Node ${tree[i]}: l=${l},r=${r}, through=${d}, max=${maxD}`,type:d===maxD&&d>0?"success":"info"});return 1+Math.max(l,r);};
      dfs(0);steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Diameter = ${maxD}`;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Max Diameter</div><div class="tbox-val" id="tvD">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[1,2,3,4,5];renderTree("vTree",tree,s.cur,[]);document.getElementById("tvD").textContent=s.maxD;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  isBalanced:{
    title:"Check if Tree is Balanced",
    desc:"Balanced if |height(left) - height(right)| ≤ 1 for every node. Return -1 upward if any subtree is unbalanced.",
    init:null,
    run(){const tree=[1,2,3,4,5,null,null,8];const steps=[];let bal=true;
      const chk=(i)=>{if(i>=tree.length||tree[i]===null)return 0;const l=chk(2*i+1),r=chk(2*i+2);if(l===-1||r===-1||Math.abs(l-r)>1){bal=false;steps.push({tree,cur:i,bal,note:`Node ${tree[i]}: |${l}-${r}|>1 → UNBALANCED`,type:"info"});return -1;}steps.push({tree,cur:i,bal,note:`Node ${tree[i]}: h=${1+Math.max(l,r)} ✓`,type:"success"});return 1+Math.max(l,r);};
      chk(0);steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Tree is ${bal?"BALANCED":"UNBALANCED"}`;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Status</div><div class="tbox-val" id="tvBal" style="font-size:0.9rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[1,2,3,4,5,null,null,8];renderTree("vTree",tree,s.cur,[]);document.getElementById("tvBal").textContent=s.bal?"✓ OK":"✗ Unbalanced";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  lcaTree:{
    title:"LCA of Binary Tree",
    desc:"If root = p or q, return root. Recurse both sides. If both return non-null, current node is the LCA.",
    init:null,
    run(){const tree=[3,5,1,6,2,0,8];const p=5,q=1;const steps=[];let lca=null;
      const dfs=(i)=>{if(i>=tree.length||tree[i]===null)return null;if(tree[i]===p||tree[i]===q){steps.push({tree,cur:i,lca,note:`Found target node ${tree[i]}`,type:"info"});return tree[i];}const l=dfs(2*i+1),r=dfs(2*i+2);if(l&&r){lca=tree[i];steps.push({tree,cur:i,lca,note:`Both sides non-null → LCA = ${tree[i]}!`,type:"success"});return tree[i];}return l||r;};
      dfs(0);steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox purple"><div class="tbox-label">LCA</div><div class="tbox-val" id="tvL">—</div></div><div class="tbox blue"><div class="tbox-label">p=5, q=1</div><div class="tbox-val"></div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[3,5,1,6,2,0,8];renderTree("vTree",tree,s.cur,[]);document.getElementById("tvL").textContent=s.lca||"—";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  zigzagOrder:{
    title:"Zigzag Level Order Traversal",
    desc:"BFS level by level. Even levels: left→right. Odd levels: right→left. Alternate direction each level.",
    init:null,
    run(){const tree=[3,9,20,null,null,15,7];const steps=[],levels=[];let queue=[0],lvl=0;
      while(queue.length){const size=queue.length,level=[];for(let i=0;i<size;i++){const idx=queue.shift();if(idx<tree.length&&tree[idx]!==null){level.push(tree[idx]);if(2*idx+1<tree.length)queue.push(2*idx+1);if(2*idx+2<tree.length)queue.push(2*idx+2);}}const row=lvl%2===0?level:[...level].reverse();levels.push(row);steps.push({tree,levels:levels.map(l=>[...l]),lvl,note:`Level ${lvl}(${lvl%2===0?"L→R":"R→L"}): [${row}]`,type:"info"});lvl++;}
      steps[steps.length-1].done=true;steps[steps.length-1].type="success";steps[steps.length-1].note=`✦ Zigzag: ${levels.map(l=>`[${l}]`).join(" ")}`;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div id="vLv" style="display:flex;flex-direction:column;gap:5px;margin:10px 0;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[3,9,20,null,null,15,7];renderTree("vTree",tree,-1,[]);document.getElementById("vLv").innerHTML=s.levels.map((l,i)=>`<div style="display:flex;gap:5px;align-items:center;"><span style="font-family:var(--mono);font-size:0.6rem;color:var(--text3);width:50px;">L${i}(${i%2===0?"→":"←"})</span>${l.map(v=>`<div class="cell" style="width:34px;height:34px;font-size:0.78rem;border-color:${i===s.lvl-1?"var(--accent)":"var(--border2)"};">${v}</div>`).join("")}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  boundaryTraversal:{
    title:"Boundary Traversal of Binary Tree",
    desc:"Collect: left boundary (top-down, no leaves) + all leaves (L→R) + right boundary (bottom-up, no leaves).",
    init:null,
    run(){const tree=[1,2,3,4,5,6,7,null,null,8,9];const steps=[],result=[1];steps.push({tree,result:[...result],note:"Start with root.",type:"info"});
      let i=2*0+1;while(i<tree.length&&tree[i]!==null){const l2=2*i+1,r2=2*i+2;if((l2<tree.length&&tree[l2]!==null)||(r2<tree.length&&tree[r2]!==null)){result.push(tree[i]);steps.push({tree,result:[...result],note:`Left boundary: ${tree[i]}`,type:"info"});}i=2*i+1;}
      const leaves=(idx)=>{if(idx>=tree.length||tree[idx]===null)return;const l=2*idx+1,r=2*idx+2;if((l>=tree.length||tree[l]===null)&&(r>=tree.length||tree[r]===null)){result.push(tree[idx]);steps.push({tree,result:[...result],note:`Leaf: ${tree[idx]}`,type:"info"});return;}leaves(l);leaves(r);};leaves(0);
      steps.push({tree,result:[...result],note:`✦ Boundary: [${result.join(", ")}]`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div id="vRes" style="display:flex;gap:5px;flex-wrap:wrap;margin:10px 0;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[1,2,3,4,5,6,7,null,null,8,9];renderTree("vTree",tree,-1,[]);document.getElementById("vRes").innerHTML=s.result.map(v=>`<div class="cell found" style="animation:none;width:38px;height:38px;font-size:0.85rem;">${v}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  maxPathSum:{
    title:"Maximum Path Sum in Binary Tree",
    desc:"At each node: gain = node.val + max(0,leftGain) + max(0,rightGain). Update global max. Return node + max(left,right) gain upward.",
    init:null,
    run(){const tree=[-10,9,20,null,null,15,7];const steps=[];let mx=-Infinity;
      const dfs=(i)=>{if(i>=tree.length||tree[i]===null)return 0;const l=Math.max(dfs(2*i+1),0),r=Math.max(dfs(2*i+2),0);const p=tree[i]+l+r;if(p>mx)mx=p;steps.push({tree,cur:i,mx,note:`Node ${tree[i]}: l=${l},r=${r}, path=${p}, max=${mx}`,type:p===mx?"success":"info"});return tree[i]+Math.max(l,r);};
      dfs(0);steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Max Path Sum = ${mx}`;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Max Path Sum</div><div class="tbox-val" id="tvMx">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[-10,9,20,null,null,15,7];renderTree("vTree",tree,s.cur,[]);document.getElementById("tvMx").textContent=s.mx===-Infinity?"—":s.mx;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  searchBST:{
    title:"Search in BST",
    desc:"If target < node: go left. If target > node: go right. Repeat until found or null. O(log n) on balanced BST.",
    init:{tree:[4,2,7,1,3],target:3},
    run(p){const{tree,target}=p||{tree:[4,2,7,1,3],target:3};let i=0;const steps=[{tree,cur:0,target,note:`Search for ${target}. Root=${tree[0]}`,type:"info"}];
      while(i<tree.length&&tree[i]!=null&&tree[i]!==undefined){if(tree[i]===target){steps.push({tree,cur:i,target,note:`✦ Found ${target} at idx ${i}!`,type:"success",done:true});return steps;}else if(target<tree[i]){steps.push({tree,cur:2*i+1,target,note:`${target}<${tree[i]} → go left`,type:"info"});i=2*i+1;}else{steps.push({tree,cur:2*i+2,target,note:`${target}>${tree[i]} → go right`,type:"info"});i=2*i+2;}}
      steps.push({tree,cur:-1,target,note:"Not found.",type:"info",done:true});return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox purple"><div class="tbox-label">Target</div><div class="tbox-val">3</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderTree("vTree",s.tree,s.cur,[]);addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  sortedArrToBST:{
    title:"Sorted Array to Balanced BST",
    desc:"Pick middle element as root (ensures balance). Recurse on left half for left subtree, right half for right subtree.",
    init:[-10,-3,0,5,9],
    run(nums){const steps=[],result=new Array(15).fill(null);
      const build=(l,r,idx)=>{if(l>r)return;const mid=Math.floor((l+r)/2);result[idx]=nums[mid];steps.push({result:[...result],note:`nums[${mid}]=${nums[mid]} → tree idx ${idx}`,type:"info"});build(l,mid-1,2*idx+1);build(mid+1,r,2*idx+2);};
      build(0,nums.length-1,0);steps[steps.length-1].done=true;steps[steps.length-1].type="success";steps[steps.length-1].note="✦ Balanced BST built!";return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderTree("vTree",s.result,-1,[]);addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  validateBST:{
    title:"Validate BST",
    desc:"Pass valid range [min, max] to each node. Node value must be strictly within range. Left child max=node.val, right child min=node.val.",
    init:null,
    run(){const tree=[5,1,4,null,null,3,6];const steps=[];let valid=true;
      const dfs=(i,mn,mx)=>{if(i>=tree.length||tree[i]===null)return true;if(tree[i]<=mn||tree[i]>=mx){valid=false;steps.push({tree,cur:i,valid,note:`${tree[i]} not in (${mn===-Infinity?"-∞":mn},${mx===Infinity?"∞":mx}) → INVALID`,type:"info"});return false;}steps.push({tree,cur:i,valid,note:`${tree[i]} ∈ (${mn===-Infinity?"-∞":mn},${mx===Infinity?"∞":mx}) ✓`,type:"success"});return dfs(2*i+1,mn,tree[i])&&dfs(2*i+2,tree[i],mx);};
      dfs(0,-Infinity,Infinity);steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ BST is ${valid?"VALID":"INVALID"}`;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Valid?</div><div class="tbox-val" id="tvV">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[5,1,4,null,null,3,6];renderTree("vTree",tree,s.cur,[]);document.getElementById("tvV").textContent=s.valid?"✓ Yes":"✗ No";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  lcaBST:{
    title:"LCA of BST",
    desc:"Exploit BST property: if both p,q < root → LCA in left. If both > root → LCA in right. Otherwise root is the LCA.",
    init:null,
    run(){const tree=[6,2,8,0,4,7,9,null,null,3,5];const p=2,q=8;let cur=0;const steps=[{tree,cur,note:`Find LCA of p=${p} and q=${q}. Root=${tree[0]}`,type:"info"}];
      while(cur<tree.length&&tree[cur]!=null){if(p<tree[cur]&&q<tree[cur]){steps.push({tree,cur:2*cur+1,note:`Both<${tree[cur]} → go left`,type:"info"});cur=2*cur+1;}else if(p>tree[cur]&&q>tree[cur]){steps.push({tree,cur:2*cur+2,note:`Both>${tree[cur]} → go right`,type:"info"});cur=2*cur+2;}else{steps.push({tree,cur,note:`✦ LCA = ${tree[cur]}!`,type:"success",done:true});return steps;}}
      return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox purple"><div class="tbox-label">p=2, q=8</div><div class="tbox-val"></div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[6,2,8,0,4,7,9,null,null,3,5];renderTree("vTree",tree,s.cur,[]);addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },


  kthSmallestBST:{
    title:"Kth Smallest in BST",
    desc:"Inorder traversal of BST yields sorted order. The kth element visited = kth smallest element.",
    init:null,
    run(){const tree=[3,1,4,null,2];const K=1;const steps=[],visited=[];let count=0,ans=null;
      const inorder=(i)=>{if(i>=tree.length||tree[i]===null||ans!==null)return;inorder(2*i+1);count++;steps.push({tree,cur:i,visited:[...visited],count,note:`Visit ${tree[i]} (count=${count})${count===K?` ✦ ${K}th smallest = ${tree[i]}!`:""}`,type:count===K?"success":"info"});if(count===K)ans=tree[i];visited.push(i);inorder(2*i+2);};
      inorder(0);steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div class="tree-wrap" id="vTree"></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">Count</div><div class="tbox-val" id="tvC">0</div></div><div class="tbox green"><div class="tbox-label">K=1 Answer</div><div class="tbox-val" id="tvA">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const tree=[3,1,4,null,2];renderTree("vTree",tree,s.cur,s.visited||[]);document.getElementById("tvC").textContent=s.count;if(s.type==="success")document.getElementById("tvA").textContent=tree[s.cur];addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  graphBFS:{
    title:"BFS of Graph",
    desc:"Queue-based. Mark start as visited, enqueue it. Dequeue node, visit all unvisited neighbors, enqueue them. Level-by-level traversal.",
    init:null,
    run(){const graph={0:[1,2],1:[0,3,4],2:[0,5],3:[1],4:[1],5:[2]};const pos={0:{x:200,y:30},1:{x:100,y:120},2:{x:300,y:120},3:{x:50,y:200},4:{x:150,y:200},5:{x:300,y:200}};
      const steps=[],visited=new Set([0]),queue=[0],order=[];steps.push({graph,pos,visited:[...visited],queue:[...queue],order:[...order],cur:-1,note:"Start BFS from node 0.",type:"info"});
      while(queue.length){const node=queue.shift();order.push(node);steps.push({graph,pos,visited:[...visited],queue:[...queue],order:[...order],cur:node,note:`Dequeue ${node}. Explore neighbors: [${graph[node]}]`,type:"info"});for(const nb of graph[node]){if(!visited.has(nb)){visited.add(nb);queue.push(nb);steps.push({graph,pos,visited:[...visited],queue:[...queue],order:[...order],cur:node,note:`Enqueue neighbor ${nb}`,type:"info"});}}}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ BFS order: ${order.join(" → ")}`;return steps;},
    render(c){c.innerHTML=`<svg id="vGraph" width="400" height="230" style="display:block;margin:0 auto;background:var(--surface2);border-radius:12px;"></svg><div class="trackers"><div class="tbox orange"><div class="tbox-label">Queue</div><div class="tbox-val" id="tvQ" style="font-size:0.8rem;">—</div></div><div class="tbox green"><div class="tbox-label">BFS Order</div><div class="tbox-val" id="tvO" style="font-size:0.75rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderGraph("vGraph",s.graph,s.pos,s.cur,new Set(s.visited),s.order);document.getElementById("tvQ").textContent=s.queue.join(", ")||"empty";document.getElementById("tvO").textContent=s.order.join(" → ")||"—";addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },

  graphDFS:{
    title:"DFS of Graph",
    desc:"Recursively visit each unvisited neighbor. Mark visited before recursing. Explores as deep as possible before backtracking.",
    init:null,
    run(){const graph={0:[1,2],1:[0,3,4],2:[0,5],3:[1],4:[1],5:[2]};const pos={0:{x:200,y:30},1:{x:100,y:120},2:{x:300,y:120},3:{x:50,y:200},4:{x:150,y:200},5:{x:300,y:200}};
      const steps=[],visited=new Set(),order=[];
      const dfs=(node)=>{visited.add(node);order.push(node);steps.push({graph,pos,visited:[...visited],order:[...order],cur:node,note:`Visit ${node}. Explore neighbors: [${graph[node]}]`,type:"info"});for(const nb of graph[node]){if(!visited.has(nb)){steps.push({graph,pos,visited:[...visited],order:[...order],cur:node,note:`${node}→${nb} unvisited, recurse`,type:"info"});dfs(nb);}}};
      dfs(0);steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ DFS order: ${order.join(" → ")}`;return steps;},
    render(c){c.innerHTML=`<svg id="vGraph" width="400" height="230" style="display:block;margin:0 auto;background:var(--surface2);border-radius:12px;"></svg><div class="trackers"><div class="tbox green"><div class="tbox-label">DFS Order</div><div class="tbox-val" id="tvO" style="font-size:0.75rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderGraph("vGraph",s.graph,s.pos,s.cur,new Set(s.visited),s.order);document.getElementById("tvO").textContent=s.order.join(" → ")||"—";addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },

  detectCycleGraph:{
    title:"Detect Cycle (Undirected) — BFS",
    desc:"Track parent of each node. If we reach an already-visited neighbor that isn't our parent → cycle exists!",
    init:null,
    run(){const graph={0:[1,2],1:[0,2],2:[0,1,3],3:[2]};const pos={0:{x:100,y:60},1:{x:300,y:60},2:{x:200,y:170},3:{x:340,y:190}};
      const steps=[],visited=new Set();let hasCycle=false;
      const bfs=(start)=>{const queue=[[start,-1]];visited.add(start);while(queue.length){const[node,par]=queue.shift();steps.push({graph,pos,visited:[...visited],cur:node,hasCycle,note:`Visit ${node} (parent=${par})`,type:"info"});for(const nb of graph[node]){if(!visited.has(nb)){visited.add(nb);queue.push([nb,node]);}else if(nb!==par){hasCycle=true;steps.push({graph,pos,visited:[...visited],cur:node,hasCycle,note:`✦ ${nb} already visited & not parent → CYCLE!`,type:"success",done:true});return;}}}};
      bfs(0);if(!hasCycle)steps.push({graph,pos,visited:[...visited],cur:-1,hasCycle,note:"No cycle found.",type:"info",done:true});return steps;},
    render(c){c.innerHTML=`<svg id="vGraph" width="400" height="230" style="display:block;margin:0 auto;background:var(--surface2);border-radius:12px;"></svg><div class="trackers"><div class="tbox pink"><div class="tbox-label">Cycle?</div><div class="tbox-val" id="tvCyc">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderGraph("vGraph",s.graph,s.pos,s.cur,new Set(s.visited),[]);document.getElementById("tvCyc").textContent=s.hasCycle?"✦ YES":"No";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  detectCycleDirected:{
    title:"Detect Cycle (Directed) — DFS",
    desc:"Track recursion stack separately from visited. If we reach a node already in the rec-stack → back edge → cycle!",
    init:null,
    run(){const graph={0:[1],1:[2],2:[3],3:[1]};const pos={0:{x:60,y:110},1:{x:180,y:50},2:{x:300,y:50},3:{x:300,y:170}};
      const steps=[],visited=new Set(),recStack=new Set();let hasCycle=false;
      const dfs=(node)=>{visited.add(node);recStack.add(node);steps.push({graph,pos,visited:[...visited],recStack:[...recStack],cur:node,hasCycle,note:`Enter ${node}. RecStack: [${[...recStack]}]`,type:"info"});
        for(const nb of(graph[node]||[])){if(recStack.has(nb)){hasCycle=true;steps.push({graph,pos,visited:[...visited],recStack:[...recStack],cur:node,hasCycle,note:`✦ ${nb} in recStack → BACK EDGE → CYCLE!`,type:"success",done:true});return;}if(!visited.has(nb))dfs(nb);}recStack.delete(node);};
      for(let i=0;i<4;i++)if(!visited.has(i))dfs(i);if(!hasCycle)steps.push({graph,pos,visited:[...visited],recStack:[],cur:-1,hasCycle,note:"No cycle.",type:"info",done:true});return steps;},
    render(c){c.innerHTML=`<svg id="vGraph" width="400" height="230" style="display:block;margin:0 auto;background:var(--surface2);border-radius:12px;"></svg><div class="trackers"><div class="tbox pink"><div class="tbox-label">Cycle?</div><div class="tbox-val" id="tvCyc">—</div></div><div class="tbox orange"><div class="tbox-label">Rec Stack</div><div class="tbox-val" id="tvRS" style="font-size:0.8rem;">[]</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderGraph("vGraph",s.graph,s.pos,s.cur,new Set(s.visited),[]);document.getElementById("tvCyc").textContent=s.hasCycle?"✦ YES":"No";document.getElementById("tvRS").textContent=`[${(s.recStack||[]).join(",")}]`;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  topoSortDFS:{
    title:"Topological Sort — DFS",
    desc:"After finishing all neighbors of a node, push it to front of result. Reversed post-order = topological ordering.",
    init:null,
    run(){const graph={5:[2,0],4:[0,1],2:[3],3:[1],0:[],1:[]};const pos={0:{x:320,y:180},1:{x:220,y:180},2:{x:180,y:80},3:{x:300,y:80},4:{x:60,y:40},5:{x:80,y:150}};
      const steps=[],visited=new Set(),stack=[];
      const dfs=(node)=>{visited.add(node);steps.push({graph,pos,visited:[...visited],stack:[...stack],cur:node,note:`DFS into node ${node}`,type:"info"});for(const nb of(graph[node]||[]))if(!visited.has(nb))dfs(nb);stack.unshift(node);steps.push({graph,pos,visited:[...visited],stack:[...stack],cur:node,note:`Node ${node} done → prepend to order: [${stack}]`,type:"info"});};
      for(const n of Object.keys(graph))if(!visited.has(parseInt(n)))dfs(parseInt(n));steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Topo order: ${stack.join(" → ")}`;return steps;},
    render(c){c.innerHTML=`<svg id="vGraph" width="400" height="230" style="display:block;margin:0 auto;background:var(--surface2);border-radius:12px;"></svg><div class="trackers"><div class="tbox blue"><div class="tbox-label">Topo Order</div><div class="tbox-val" id="tvT" style="font-size:0.75rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderGraph("vGraph",s.graph,s.pos,s.cur,new Set(s.visited),[]);document.getElementById("tvT").textContent=s.stack.join(" → ")||"—";addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },

  topoSortBFS:{
    title:"Topological Sort — Kahn's (BFS)",
    desc:"Compute in-degrees. Enqueue all zero-in-degree nodes. Dequeue, add to result, reduce neighbor in-degrees. Repeat.",
    init:null,
    run(){const graph={0:[],1:[],2:[3],3:[1],4:[0,1],5:[2,0]};const pos={0:{x:320,y:180},1:{x:220,y:180},2:{x:180,y:80},3:{x:300,y:80},4:{x:60,y:40},5:{x:80,y:150}};
      const n=6,inDeg=Array(n).fill(0);Object.entries(graph).forEach(([u,vs])=>vs.forEach(v=>inDeg[v]++));const queue=[...inDeg.map((d,i)=>d===0?i:-1).filter(i=>i>=0)],result=[],curDeg=[...inDeg];
      const steps=[{graph,pos,visited:new Set(),queue:[...queue],result:[],note:`In-degrees: [${inDeg}]. Enqueue zero-degree: [${queue}]`,type:"info"}];
      while(queue.length){const node=queue.shift();result.push(node);steps.push({graph,pos,visited:new Set(result),queue:[...queue],result:[...result],note:`Dequeue ${node}. Result so far: [${result}]`,type:"info"});for(const nb of(graph[node]||[])){curDeg[nb]--;if(curDeg[nb]===0){queue.push(nb);steps.push({graph,pos,visited:new Set(result),queue:[...queue],result:[...result],note:`${nb} in-degree→0, enqueue`,type:"info"});}}}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Topo order: ${result.join(" → ")}`;return steps;},
    render(c){c.innerHTML=`<svg id="vGraph" width="400" height="230" style="display:block;margin:0 auto;background:var(--surface2);border-radius:12px;"></svg><div class="trackers"><div class="tbox orange"><div class="tbox-label">Queue</div><div class="tbox-val" id="tvQ" style="font-size:0.8rem;">—</div></div><div class="tbox blue"><div class="tbox-label">Topo Order</div><div class="tbox-val" id="tvT" style="font-size:0.75rem;">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){renderGraph("vGraph",s.graph,s.pos,-1,s.visited,s.result);document.getElementById("tvQ").textContent=s.queue.join(", ")||"empty";document.getElementById("tvT").textContent=s.result.join(" → ")||"—";addLogLine("vLog",s.note,s.done?"highlight":"info");}
  },

  numIslands:{
    title:"Number of Islands — DFS",
    desc:"DFS from each unvisited '1'. Sink all connected land to visited. Count how many DFS calls you make = number of islands.",
    init:[["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]],
    run(grid){const g=grid.map(r=>[...r]);const steps=[{grid:g.map(r=>[...r]),count:0,cur:[-1,-1],note:"Find islands via DFS sinking.",type:"info"}];let count=0;
      const dfs=(i,j)=>{if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!=="1")return;g[i][j]="v";steps.push({grid:g.map(r=>[...r]),count,cur:[i,j],note:`Sink cell (${i},${j})`,type:"info"});dfs(i+1,j);dfs(i-1,j);dfs(i,j+1);dfs(i,j-1);};
      for(let i=0;i<g.length;i++)for(let j=0;j<g[0].length;j++)if(g[i][j]==="1"){count++;steps.push({grid:g.map(r=>[...r]),count,cur:[i,j],note:`New island #${count} found at (${i},${j})!`,type:"success"});dfs(i,j);}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Total islands: ${count}`;return steps;},
    render(c){c.innerHTML=`<div id="vGrid" style="display:flex;flex-direction:column;gap:4px;align-items:center;margin:8px 0;"></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">Islands Found</div><div class="tbox-val" id="tvC">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const clr={"1":"border-color:var(--green);color:var(--green-light);background:rgba(16,185,129,0.1);","0":"opacity:0.3;","v":"border-color:var(--blue);color:var(--blue-light);background:rgba(59,130,246,0.1);"};document.getElementById("vGrid").innerHTML=s.grid.map((row,i)=>`<div style="display:flex;gap:4px;">${row.map((v,j)=>`<div class="cell" style="width:38px;height:38px;font-size:0.78rem;${i===s.cur[0]&&j===s.cur[1]?"border-color:var(--orange);transform:scale(1.1);":clr[v]||""}">${v==="v"?"✓":v}</div>`).join("")}</div>`).join("");document.getElementById("tvC").textContent=s.count;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  lisDP:{
    title:"Longest Increasing Subsequence — DP",
    desc:"dp[i] = length of LIS ending at index i. For each i, check all j<i where arr[j]<arr[i]. dp[i] = max(dp[j]+1).",
    init:[10,9,2,5,3,7,101,18],presets:[[10,9,2,5,3,7,101,18],[3,10,2,1,20],[0,1,0,3,2,3]],
    run(nums){const dp=Array(nums.length).fill(1);const steps=[{arr:nums,dp:[...dp],i:-1,j:-1,note:"Init: all dp[i]=1 (single element is LIS of 1).",type:"info"}];
      for(let i=1;i<nums.length;i++){for(let j=0;j<i;j++){if(nums[j]<nums[i]&&dp[j]+1>dp[i]){dp[i]=dp[j]+1;steps.push({arr:nums,dp:[...dp],i,j,note:`nums[${j}]=${nums[j]}<nums[${i}]=${nums[i]} → dp[${i}]=dp[${j}]+1=${dp[i]}`,type:"success"});}else{steps.push({arr:nums,dp:[...dp],i,j,note:`nums[${j}]=${nums[j]}≥${nums[i]} or no gain`,type:"info"});}}}
      const lis=Math.max(...dp);steps.push({arr:nums,dp:[...dp],i:-1,j:-1,note:`✦ LIS length = ${lis}`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="arr-wrap" id="vDP" style="margin-top:4px;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">LIS Length</div><div class="tbox-val" id="tvL">1</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map((v,i)=>`<div class="cell ${i===s.i?"cur":i===s.j?"left":""}">${v}</div>`).join("");document.getElementById("vDP").innerHTML=s.dp.map((v,i)=>`<div class="cell ${i===s.i?"cur":""}" style="border-color:var(--accent);color:var(--accent-light);font-size:0.78rem;width:48px;height:38px;"><span class="ci">dp</span>${v}</div>`).join("");document.getElementById("tvL").textContent=Math.max(...s.dp);addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  editDistance:{
    title:"Edit Distance — Levenshtein DP",
    desc:"dp[i][j] = min ops to convert s1[0..i] to s2[0..j]. Match → dp[i-1][j-1]. Else → 1 + min(insert, delete, replace).",
    init:{s1:"horse",s2:"ros"},presets:[{s1:"horse",s2:"ros"},{s1:"intention",s2:"execution"},{s1:"abc",s2:"abc"}],
    run(p){const{s1,s2}=p||{s1:"horse",s2:"ros"};const m=s1.length,n=s2.length;const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));const steps=[{dp:dp.map(r=>[...r]),i:0,j:0,s1,s2,note:"Base cases: empty string needs i insertions/deletions.",type:"info"}];
      for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){if(s1[i-1]===s2[j-1]){dp[i][j]=dp[i-1][j-1];steps.push({dp:dp.map(r=>[...r]),i,j,s1,s2,note:`'${s1[i-1]}'='${s2[j-1]}' match → dp[${i}][${j}]=${dp[i][j]} (no cost)`,type:"success"});}else{dp[i][j]=1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);steps.push({dp:dp.map(r=>[...r]),i,j,s1,s2,note:`'${s1[i-1]}'≠'${s2[j-1]}' → 1+min(del=${dp[i-1][j]},ins=${dp[i][j-1]},rep=${dp[i-1][j-1]})=${dp[i][j]}`,type:"info"});}}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Edit distance = ${dp[m][n]}`;return steps;},
    render(c){c.innerHTML=`<div class="dp-table-wrap" id="vDP" style="overflow-x:auto;"></div><div class="step-log" id="vLog" style="margin-top:10px;"></div>`;},
    update(s){const{s1,s2}=s;let h=`<table class="dp-table"><tr><td class="dp-header"></td><td class="dp-header">ε</td>${s2.split("").map(c=>`<td class="dp-header">${c}</td>`).join("")}</tr>`;for(let i=0;i<=s1.length;i++){h+=`<tr><td class="dp-header">${i===0?"ε":s1[i-1]}</td>`;for(let j=0;j<=s2.length;j++)h+=`<td class="${i===s.i&&j===s.j?"dp-cur":s.dp[i][j]>0||(i>0||j>0)?"dp-filled":""}">${s.dp[i][j]}</td>`;h+="</tr>";}h+="</table>";document.getElementById("vDP").innerHTML=h;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },


  maxSumRect:{
    title:"Maximum Sum Rectangle — Kadane's on 2D",
    desc:"Fix left and right column boundaries. Compress rows to 1D column sums. Apply Kadane's algorithm on that 1D array. Try all O(n²) column pairs.",
    init:[[1,2,-1,-4,-20],[-8,-3,4,2,1],[3,8,10,1,3],[-4,-1,1,7,-6]],
    run(mat){const m=mat.length,n=mat[0].length;let maxSum=-Infinity,bL=0,bR=0;const steps=[{mat,note:"Fix column pairs, compress rows, apply Kadane's.",type:"info",maxSum,bL,bR}];
      for(let l=0;l<n;l++){const temp=Array(m).fill(0);for(let r=l;r<n;r++){for(let i=0;i<m;i++)temp[i]+=mat[i][r];let cur=temp[0],mx=temp[0];for(let i=1;i<m;i++){cur=Math.max(temp[i],cur+temp[i]);mx=Math.max(mx,cur);}if(mx>maxSum){maxSum=mx;bL=l;bR=r;steps.push({mat,note:`Cols[${l}..${r}]: sums=[${temp}] Kadane max=${mx} ✦ new best!`,type:"success",maxSum,bL,bR});}else steps.push({mat,note:`Cols[${l}..${r}]: Kadane max=${mx}`,type:"info",maxSum,bL,bR});}}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Max sum = ${maxSum} (cols ${bL}..${bR})`;return steps;},
    render(c){c.innerHTML=`<div id="vMat" style="display:flex;flex-direction:column;gap:4px;align-items:center;margin:8px 0;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Max Sum</div><div class="tbox-val" id="tvMx">—</div></div><div class="tbox blue"><div class="tbox-label">Best Cols</div><div class="tbox-val" id="tvCl">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vMat").innerHTML=s.mat.map(row=>`<div style="display:flex;gap:4px;">${row.map((v,j)=>`<div class="cell" style="width:42px;height:42px;font-size:0.8rem;${j>=s.bL&&j<=s.bR?"border-color:var(--accent);color:var(--accent-light);background:rgba(124,58,237,0.08);":""}">${v}</div>`).join("")}</div>`).join("");document.getElementById("tvMx").textContent=s.maxSum===-Infinity?"—":s.maxSum;document.getElementById("tvCl").textContent=`[${s.bL},${s.bR}]`;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  knapsack01:{
    title:"0-1 Knapsack — DP Table",
    desc:"dp[i][w] = max value using first i items with capacity w. Either skip item i, or include it (if weight fits).",
    init:{wt:[1,3,4,5],val:[1,4,5,7],W:7},
    run(p){const{wt,val,W}=p||{wt:[1,3,4,5],val:[1,4,5,7],W:7};const n=wt.length;const dp=Array.from({length:n+1},()=>Array(W+1).fill(0));const steps=[{dp:dp.map(r=>[...r]),i:0,j:0,note:`n=${n} items, capacity W=${W}`,type:"info"}];
      for(let i=1;i<=n;i++)for(let w=0;w<=W;w++){if(wt[i-1]<=w){const take=val[i-1]+dp[i-1][w-wt[i-1]],skip=dp[i-1][w];dp[i][w]=Math.max(skip,take);steps.push({dp:dp.map(r=>[...r]),i,j:w,note:`Item ${i}(wt=${wt[i-1]},val=${val[i-1]}), cap=${w}: max(skip=${skip}, take=${take})=${dp[i][w]}`,type:take>skip?"success":"info"});}else{dp[i][w]=dp[i-1][w];steps.push({dp:dp.map(r=>[...r]),i,j:w,note:`Item ${i} too heavy for cap=${w}, skip`,type:"info"});}}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Max value = ${dp[n][W]}`;return steps;},
    render(c){c.innerHTML=`<div class="dp-table-wrap" id="vDP" style="overflow-x:auto;"></div><div class="step-log" id="vLog" style="margin-top:10px;"></div>`;},
    update(s){const W=s.dp[0].length-1;let h=`<table class="dp-table"><tr><td class="dp-header">i\\w</td>${Array.from({length:W+1},(_,w)=>`<td class="dp-header">${w}</td>`).join("")}</tr>`;s.dp.forEach((row,i)=>{h+=`<tr><td class="dp-header">${i}</td>${row.map((v,w)=>`<td class="${i===s.i&&w===s.j?"dp-cur":v>0?"dp-filled":""}">${v}</td>`).join("")}</tr>`;});h+="</table>";document.getElementById("vDP").innerHTML=h;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  coinChange:{
    title:"Coin Change — Minimum Coins",
    desc:"dp[i] = min coins to make amount i. For each coin c: dp[i] = min(dp[i], dp[i-c]+1). dp[0]=0, rest start at ∞.",
    init:{coins:[1,5,6,9],amount:11},presets:[{coins:[1,5,6,9],amount:11},{coins:[1,2,5],amount:11},{coins:[2],amount:3}],
    run(p){const{coins,amount}=p||{coins:[1,5,6,9],amount:11};const dp=Array(amount+1).fill(Infinity);dp[0]=0;const steps=[{dp:[...dp],note:`Init: dp[0]=0, rest=∞. Coins=[${coins}]`,type:"info",cur:0}];
      for(let i=1;i<=amount;i++){for(const c of coins){if(c<=i&&dp[i-c]+1<dp[i]){dp[i]=dp[i-c]+1;steps.push({dp:[...dp],note:`Amount ${i}: coin ${c} → dp[${i}]=${dp[i]}`,type:"success",cur:i});}}if(dp[i]===Infinity)steps.push({dp:[...dp],note:`Amount ${i}: no valid coin fits`,type:"info",cur:i});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Min coins for ${amount} = ${dp[amount]===Infinity?"impossible":dp[amount]}`;return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr" style="flex-wrap:wrap;gap:6px;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Answer</div><div class="tbox-val" id="tvA">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.dp.map((v,i)=>`<div class="cell ${i===s.cur?"cur":v<Infinity?"found":""}" style="animation:none;width:46px;height:46px;font-size:0.75rem;"><span class="ci">${i}</span>${v===Infinity?"∞":v}</div>`).join("");const last=s.dp[s.dp.length-1];document.getElementById("tvA").textContent=last===Infinity?"N/A":last;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  subsetSumDP:{
    title:"Subset Sum — DP Table (Boolean)",
    desc:"dp[i][s] = can we achieve sum s using first i elements? True if skip (dp[i-1][s]) OR include (arr[i]≤s && dp[i-1][s-arr[i]]).",
    init:{arr:[3,34,4,12,5,2],target:9},
    run(p){const{arr,target}=p||{arr:[3,34,4,12,5,2],target:9};const n=arr.length;const dp=Array.from({length:n+1},(_,i)=>Array.from({length:target+1},(_,j)=>j===0));const steps=[{dp:dp.map(r=>[...r]),i:0,j:0,note:`Can we make sum ${target} from [${arr}]?`,type:"info"}];
      for(let i=1;i<=n;i++)for(let s=1;s<=target;s++){dp[i][s]=dp[i-1][s]||(arr[i-1]<=s&&dp[i-1][s-arr[i-1]]);steps.push({dp:dp.map(r=>[...r]),i,j:s,note:`Item ${arr[i-1]}, sum ${s}: skip=${dp[i-1][s]?1:0}, take=${arr[i-1]<=s&&dp[i-1][s-arr[i-1]]?1:0} → ${dp[i][s]?"T":"F"}`,type:dp[i][s]?"success":"info"});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Sum ${target} is ${dp[n][target]?"ACHIEVABLE":"NOT achievable"}`;return steps;},
    render(c){c.innerHTML=`<div class="dp-table-wrap" id="vDP" style="overflow-x:auto;"></div><div class="step-log" id="vLog" style="margin-top:10px;"></div>`;},
    update(s){const cols=s.dp[0].length;let h=`<table class="dp-table"><tr><td class="dp-header">i\\s</td>${Array.from({length:cols},(_,j)=>`<td class="dp-header">${j}</td>`).join("")}</tr>`;s.dp.forEach((row,i)=>{h+=`<tr><td class="dp-header">${i}</td>${row.map((v,j)=>`<td class="${i===s.i&&j===s.j?"dp-cur":v?"dp-filled":""}">${v?"T":"F"}</td>`).join("")}</tr>`;});h+="</table>";document.getElementById("vDP").innerHTML=h;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  rodCutting:{
    title:"Rod Cutting — DP",
    desc:"dp[i] = max profit from rod of length i. For each cut length j: dp[i] = max(dp[i], price[j-1] + dp[i-j]). Build bottom-up.",
    init:{price:[1,5,8,9,10,17,17,20],n:8},
    run(p){const{price,n}=p||{price:[1,5,8,9,10,17,17,20],n:8};const dp=Array(n+1).fill(0);const steps=[{dp:[...dp],note:`Rod length n=${n}. Find max profit.`,type:"info",cur:0}];
      for(let i=1;i<=n;i++){for(let j=1;j<=i;j++){if(price[j-1]+dp[i-j]>dp[i]){dp[i]=price[j-1]+dp[i-j];steps.push({dp:[...dp],note:`len=${i}: cut ${j}(price=${price[j-1]})+dp[${i-j}]=${dp[i]} ✦ better`,type:"success",cur:i});}}steps.push({dp:[...dp],note:`dp[${i}]=${dp[i]}`,type:"info",cur:i});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Max profit for rod of length ${n} = ${dp[n]}`;return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr" style="flex-wrap:wrap;gap:6px;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Max Profit</div><div class="tbox-val" id="tvP">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.dp.map((v,i)=>`<div class="cell ${i===s.cur?"cur":v>0?"found":""}" style="animation:none;width:46px;height:46px;font-size:0.8rem;"><span class="ci">${i}</span>${v}</div>`).join("");document.getElementById("tvP").textContent=s.dp[s.dp.length-1];addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  eggDrop:{
    title:"Egg Drop — DP",
    desc:"dp[e][f] = min trials with e eggs, f floors. Try floor k: worst = 1 + max(dp[e-1][k-1], dp[e][f-k]). Minimize over all k.",
    init:{eggs:2,floors:6},
    run(p){const{eggs,floors}=p||{eggs:2,floors:6};const dp=Array.from({length:eggs+1},()=>Array(floors+1).fill(0));for(let f=1;f<=floors;f++)dp[1][f]=f;for(let e=2;e<=eggs;e++)dp[e][1]=1;const steps=[{dp:dp.map(r=>[...r]),note:`Init: 1 egg needs f trials, 1 floor needs 1 trial.`,type:"info",ci:1,cj:1}];
      for(let e=2;e<=eggs;e++)for(let f=2;f<=floors;f++){dp[e][f]=Infinity;for(let k=1;k<=f;k++){const w=1+Math.max(dp[e-1][k-1],dp[e][f-k]);if(w<dp[e][f]){dp[e][f]=w;steps.push({dp:dp.map(r=>[...r]),note:`e=${e},f=${f},floor ${k}: worst=${w} ✦ new min`,type:"success",ci:e,cj:f});}}if(!isFinite(dp[e][f]))dp[e][f]=0;}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Min trials for ${eggs} eggs, ${floors} floors = ${dp[eggs][floors]}`;return steps;},
    render(c){c.innerHTML=`<div class="dp-table-wrap" id="vDP" style="overflow-x:auto;"></div><div class="step-log" id="vLog" style="margin-top:10px;"></div>`;},
    update(s){const F=s.dp[0].length-1;let h=`<table class="dp-table"><tr><td class="dp-header">e\\f</td>${Array.from({length:F+1},(_,f)=>`<td class="dp-header">${f}</td>`).join("")}</tr>`;s.dp.forEach((row,e)=>{h+=`<tr><td class="dp-header">${e}</td>${row.map((v,f)=>`<td class="${e===s.ci&&f===s.cj?"dp-cur":v>0?"dp-filled":""}">${v||""}</td>`).join("")}</tr>`;});h+="</table>";document.getElementById("vDP").innerHTML=h;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  stackUsingQueue:{
    title:"Implement Stack Using Queues",
    desc:"Push: enqueue to Q2, then dequeue all from Q1 into Q2, then swap Q1↔Q2. Pop/Top: just dequeue from Q1. O(n) push, O(1) pop.",
    init:[1,2,3,4],
    run(nums){let q1=[],q2=[];const steps=[{q1:[...q1],q2:[],top:null,note:"Init: two empty queues.",type:"info",ops:[]}];
      const ops=[];for(const v of nums){q2=[v];ops.push(`push(${v})`);steps.push({q1:[...q1],q2:[...q2],top:null,note:`push(${v}): enqueue ${v} to Q2`,type:"info",ops:[...ops]});while(q1.length){q2.push(q1.shift());}[q1,q2]=[q2,[]];steps.push({q1:[...q1],q2:[],top:q1[0],note:`Dequeued Q1 to Q2, swap. Stack top=${q1[0]}`,type:"success",ops:[...ops]});}
      while(q1.length>1){const popped=q1.shift();ops.push(`pop()=${popped}`);steps.push({q1:[...q1],q2:[],top:q1[0]??null,note:`pop() = ${popped}. Stack top=${q1[0]??'empty'}`,type:"success",ops:[...ops]});}
      steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin:8px 0;"><div><div class="viz-label">Q1 (active)</div><div class="arr-wrap" id="vQ1" style="flex-direction:column-reverse;min-height:80px;"></div></div><div><div class="viz-label">Q2 (temp)</div><div class="arr-wrap" id="vQ2" style="min-height:80px;"></div></div></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">Stack Top</div><div class="tbox-val" id="tvTop">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vQ1").innerHTML=s.q1.map(v=>`<div class="cell" style="animation:none;width:48px;height:38px;">${v}</div>`).join("");document.getElementById("vQ2").innerHTML=s.q2.map(v=>`<div class="cell cur" style="width:48px;height:38px;">${v}</div>`).join("");document.getElementById("tvTop").textContent=s.top??"-";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  queueUsingStack:{
    title:"Implement Queue Using Stacks",
    desc:"Push to S1. For dequeue: if S2 is empty, move all S1 to S2, then pop from S2. O(1) amortized.",
    init:[1,2,3,4],
    run(nums){let s1=[],s2=[];const steps=[{s1:[],s2:[],note:"Init: two empty stacks.",type:"info",front:null}];
      for(const v of nums){s1.push(v);steps.push({s1:[...s1],s2:[...s2],note:`enqueue(${v}): push to S1`,type:"info",front:s2.length?s2[s2.length-1]:null});}
      while(s1.length||s2.length){if(!s2.length){steps.push({s1:[...s1],s2:[...s2],note:`S2 empty: transfer S1→S2`,type:"info",front:null});while(s1.length)s2.push(s1.pop());steps.push({s1:[...s1],s2:[...s2],note:`Transferred. S2 top is front=${s2[s2.length-1]}`,type:"success",front:s2[s2.length-1]});}const val=s2.pop();steps.push({s1:[...s1],s2:[...s2],note:`dequeue() = ${val}`,type:"success",front:s2[s2.length-1]??null});}
      steps[steps.length-1].done=true;return steps;},
    render(c){c.innerHTML=`<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin:8px 0;"><div><div class="viz-label">S1 (in)</div><div class="arr-wrap" id="vS1" style="flex-direction:column-reverse;min-height:80px;"></div></div><div><div class="viz-label">S2 (out)</div><div class="arr-wrap" id="vS2" style="flex-direction:column-reverse;min-height:80px;"></div></div></div><div class="trackers"><div class="tbox blue"><div class="tbox-label">Queue Front</div><div class="tbox-val" id="tvFt">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vS1").innerHTML=s.s1.map(v=>`<div class="cell" style="animation:none;width:48px;height:38px;">${v}</div>`).join("");document.getElementById("vS2").innerHTML=s.s2.map(v=>`<div class="cell found" style="animation:none;width:48px;height:38px;">${v}</div>`).join("");document.getElementById("tvFt").textContent=s.front??"-";addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  nextGreater:{
    title:"Next Greater Element — Monotonic Stack",
    desc:"Use a decreasing stack. For each element, pop all smaller elements — the current element is their next greater. O(n).",
    init:[4,5,2,25,7,8],presets:[[4,5,2,25,7,8],[1,3,2,4],[5,4,3,2,1]],
    run(nums){const result=Array(nums.length).fill(-1);const stack=[];const steps=[{arr:nums,stack:[],result:[...result],cur:-1,note:"Process left to right with decreasing stack.",type:"info"}];
      for(let i=0;i<nums.length;i++){steps.push({arr:nums,stack:[...stack],result:[...result],cur:i,note:`Element ${nums[i]}: check stack top`,type:"info"});while(stack.length&&nums[stack[stack.length-1]]<nums[i]){const idx=stack.pop();result[idx]=nums[i];steps.push({arr:nums,stack:[...stack],result:[...result],cur:i,note:`${nums[idx]} < ${nums[i]}: NGE of idx ${idx} = ${nums[i]}`,type:"success"});}stack.push(i);}
      steps.push({arr:nums,stack:[],result:[...result],cur:-1,note:`✦ Result: [${result}]`,type:"success",done:true});return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="viz-label" style="margin-top:8px;">Monotonic Stack (indices)</div><div class="arr-wrap" id="vStk"></div><div class="viz-label" style="margin-top:8px;">Result (NGE)</div><div class="arr-wrap" id="vRes"></div><div class="step-log" id="vLog" style="margin-top:8px;"></div>`;},
    update(s){document.getElementById("vArr").innerHTML=s.arr.map((v,i)=>`<div class="cell ${i===s.cur?"cur":""}">${v}</div>`).join("");document.getElementById("vStk").innerHTML=s.stack.map(i=>`<div class="cell" style="border-color:var(--orange);color:var(--orange);width:42px;height:38px;font-size:0.8rem;">[${i}]${s.arr[i]}</div>`).join("");document.getElementById("vRes").innerHTML=s.result.map(v=>`<div class="cell ${v!==-1?"found":""}" style="animation:none;font-size:0.85rem;">${v===-1?"?":v}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  largestRect:{
    title:"Largest Rectangle in Histogram",
    desc:"Monotonic increasing stack. For each bar, when we see a shorter bar, pop and compute area. Width = current index - stack top - 1.",
    init:[2,1,5,6,2,3],presets:[[2,1,5,6,2,3],[6,2,5,4,5,1,6],[2,4]],
    run(heights){const n=heights.length;const stack=[];let maxArea=0;const steps=[{heights,stack:[],maxArea,cur:-1,note:"Process bars with increasing stack.",type:"info"}];
      for(let i=0;i<=n;i++){const h=i===n?0:heights[i];while(stack.length&&heights[stack[stack.length-1]]>h){const top=stack.pop();const w=stack.length?i-stack[stack.length-1]-1:i;const area=heights[top]*w;if(area>maxArea)maxArea=area;steps.push({heights,stack:[...stack],maxArea,cur:i,note:`Pop idx ${top}(h=${heights[top]}), width=${w}, area=${area}${area===maxArea?" ✦ NEW MAX":""}`,type:area===maxArea?"success":"info"});}stack.push(i);if(i<n)steps.push({heights,stack:[...stack],maxArea,cur:i,note:`Push idx ${i}(h=${heights[i]})`,type:"info"});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Largest rectangle area = ${maxArea}`;return steps;},
    render(c){c.innerHTML=`<div id="vHist" style="display:flex;gap:4px;align-items:flex-end;height:130px;margin:8px auto;justify-content:center;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Max Area</div><div class="tbox-val" id="tvA">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){const mx=Math.max(...s.heights,1);document.getElementById("vHist").innerHTML=s.heights.map((h,i)=>`<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><span style="font-family:var(--mono);font-size:0.6rem;color:var(--text3);">${h}</span><div style="width:32px;height:${Math.round(h/mx*100)}px;background:${i===s.cur?"var(--accent)":s.stack.includes(i)?"var(--blue)":"var(--green)"};border-radius:4px 4px 0 0;opacity:0.8;transition:all 0.2s;"></div></div>`).join("");document.getElementById("tvA").textContent=s.maxArea;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },


  slidingWindowMax:{
    title:"Sliding Window Maximum — Deque",
    desc:"Monotonic decreasing deque stores indices. Maintain: remove indices out of window; remove smaller elements from back. Deque front = window max.",
    init:{nums:[1,3,-1,-3,5,3,6,7],k:3},presets:[{nums:[1,3,-1,-3,5,3,6,7],k:3},{nums:[1,-1],k:1}],
    run(p){const{nums,k}=p||{nums:[1,3,-1,-3,5,3,6,7],k:3};const dq=[],result=[];const steps=[{nums,dq:[],result:[],cur:-1,note:`Window size k=${k}. Maintain decreasing deque.`,type:"info"}];
      for(let i=0;i<nums.length;i++){while(dq.length&&dq[0]<i-k+1)dq.shift();while(dq.length&&nums[dq[dq.length-1]]<nums[i])dq.pop();dq.push(i);if(i>=k-1){result.push(nums[dq[0]]);steps.push({nums,dq:[...dq],result:[...result],cur:i,note:`Window [${i-k+1}..${i}]: max=${nums[dq[0]]} (deque front)`,type:"success"});}else{steps.push({nums,dq:[...dq],result:[...result],cur:i,note:`Building window... deque: [${dq.map(j=>nums[j])}]`,type:"info"});}}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Window maxima: [${result}]`;return steps;},
    render(c){c.innerHTML=`<div class="arr-wrap" id="vArr"></div><div class="viz-label" style="margin-top:8px;">Deque (values)</div><div class="arr-wrap" id="vDq"></div><div class="viz-label" style="margin-top:8px;">Result</div><div class="arr-wrap" id="vRes"></div><div class="step-log" id="vLog" style="margin-top:8px;"></div>`;},
    update(s){const k=(s.nums.length-s.result.length)||3;document.getElementById("vArr").innerHTML=s.nums.map((v,i)=>`<div class="cell ${i===s.cur?"cur":s.dq.includes(i)?"found":i<s.cur-k+2?"sorted":""}" style="animation:none;">${v}</div>`).join("");document.getElementById("vDq").innerHTML=s.dq.map(i=>`<div class="cell" style="border-color:var(--orange);color:var(--orange);animation:none;">${s.nums[i]}</div>`).join("");document.getElementById("vRes").innerHTML=s.result.map(v=>`<div class="cell found" style="animation:none;">${v}</div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  nMeetings:{
    title:"N Meetings in One Room — Greedy",
    desc:"Sort by end time. Greedily pick meetings that start after the last selected meeting ends. The earliest-ending meeting leaves most room.",
    init:{start:[1,3,0,5,8,5],end:[2,4,6,7,9,9]},
    run(p){const{start,end}=p||{start:[1,3,0,5,8,5],end:[2,4,6,7,9,9]};const n=start.length;const meetings=Array.from({length:n},(_,i)=>({i,s:start[i],e:end[i]})).sort((a,b)=>a.e-b.e);const selected=[],steps=[{meetings,selected:[],lastEnd:-1,note:`Sorted by end time: ${meetings.map(m=>`[${m.s},${m.e}]`).join(" ")}`,type:"info"}];
      let lastEnd=-1;for(const m of meetings){if(m.s>lastEnd){selected.push(m.i);lastEnd=m.e;steps.push({meetings,selected:[...selected],lastEnd,note:`[${m.s},${m.e}] starts after ${lastEnd===m.e?'prev end':lastEnd}: SELECT #${selected.length}`,type:"success"});}else steps.push({meetings,selected:[...selected],lastEnd,note:`[${m.s},${m.e}] overlaps lastEnd=${lastEnd}: SKIP`,type:"info"});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Max meetings = ${selected.length}: meetings ${selected.map(i=>i+1).join(",")}`;return steps;},
    render(c){c.innerHTML=`<div id="vMt" style="display:flex;flex-direction:column;gap:5px;margin:8px 0;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Selected</div><div class="tbox-val" id="tvSl">0</div></div><div class="tbox orange"><div class="tbox-label">Last End</div><div class="tbox-val" id="tvLe">-1</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vMt").innerHTML=s.meetings.map(m=>`<div style="display:flex;align-items:center;gap:8px;"><span style="font-family:var(--mono);font-size:0.72rem;color:var(--text3);width:28px;">M${m.i+1}</span><div style="height:28px;border-radius:6px;border:2px solid ${s.selected.includes(m.i)?"var(--green)":"var(--border2)"};background:${s.selected.includes(m.i)?"rgba(16,185,129,0.1)":"transparent"};padding:0 10px;display:flex;align-items:center;font-family:var(--mono);font-size:0.75rem;color:${s.selected.includes(m.i)?"var(--green-light)":"var(--text2)"};">[${m.s}, ${m.e}]</div></div>`).join("");document.getElementById("tvSl").textContent=s.selected.length;document.getElementById("tvLe").textContent=s.lastEnd;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  minPlatforms:{
    title:"Minimum Platforms Required",
    desc:"Sort arrivals and departures separately. Use two pointers. If next arrival < next departure, need new platform. Else free one.",
    init:{arr:[900,940,950,1100,1500,1800],dep:[910,1200,1120,1130,1900,2000]},
    run(p){const{arr,dep}=p||{arr:[900,940,950,1100,1500,1800],dep:[910,1200,1120,1130,1900,2000]};const a=[...arr].sort((x,y)=>x-y),d=[...dep].sort((x,y)=>x-y);let i=1,j=0,cur=1,mx=1;const steps=[{a,d,i,j,cur,mx,note:`Sorted arrivals=[${a}] departures=[${d}]. Start with platform=1.`,type:"info"}];
      while(i<a.length&&j<d.length){if(a[i]<=d[j]){cur++;if(cur>mx)mx=cur;steps.push({a,d,i,j,cur,mx,note:`arr[${i}]=${a[i]}≤dep[${j}]=${d[j]}: new train arrives → platforms=${cur}${cur===mx?" ✦ new max":""}`,type:cur===mx?"success":"info"});i++;}else{cur--;steps.push({a,d,i,j,cur,mx,note:`arr[${i}]=${a[i]}>dep[${j}]=${d[j]}: train departs → platforms=${cur}`,type:"info"});j++;}}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Minimum platforms needed = ${mx}`;return steps;},
    render(c){c.innerHTML=`<div class="trackers"><div class="tbox blue"><div class="tbox-label">Current Platforms</div><div class="tbox-val" id="tvCp">1</div></div><div class="tbox green"><div class="tbox-label">Max Platforms</div><div class="tbox-val" id="tvMx">1</div></div></div><div id="vBar" style="display:flex;gap:4px;align-items:flex-end;height:80px;margin:12px 0 8px;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("tvCp").textContent=s.cur;document.getElementById("tvMx").textContent=s.mx;const bars=Array.from({length:s.mx},(_,k)=>`<div style="flex:1;background:${k<s.cur?"var(--blue)":"var(--surface3)"};border-radius:4px;height:${Math.round((k+1)/s.mx*70)+10}px;transition:all 0.3s;"></div>`);document.getElementById("vBar").innerHTML=bars.join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  jobSequencing:{
    title:"Job Sequencing — Greedy",
    desc:"Sort jobs by profit (descending). For each job, assign to latest available slot ≤ deadline. Greedy: high-profit jobs first.",
    init:{jobs:[{id:"A",d:2,p:100},{id:"B",d:1,p:19},{id:"C",d:2,p:27},{id:"D",d:1,p:25},{id:"E",d:3,p:15}]},
    run(p){const jobs=(p&&p.jobs)||[{id:"A",d:2,p:100},{id:"B",d:1,p:19},{id:"C",d:2,p:27},{id:"D",d:1,p:25},{id:"E",d:3,p:15}];const sorted=[...jobs].sort((a,b)=>b.p-a.p);const maxD=Math.max(...sorted.map(j=>j.d));const slots=Array(maxD+1).fill(null);let profit=0;const steps=[{jobs:sorted,slots:[...slots],profit,note:`Sorted by profit desc. Max deadline=${maxD}.`,type:"info"}];
      for(const job of sorted){for(let t=job.d;t>=1;t--){if(!slots[t]){slots[t]=job.id;profit+=job.p;steps.push({jobs:sorted,slots:[...slots],profit,note:`Job ${job.id}(p=${job.p}) → slot ${t}. Total profit=${profit}`,type:"success"});break;}}if(!steps[steps.length-1].note.includes(job.id))steps.push({jobs:sorted,slots:[...slots],profit,note:`Job ${job.id}(p=${job.p}): no free slot, skip`,type:"info"});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Max profit=${profit}. Jobs: [${slots.slice(1).join(",")}]`;return steps;},
    render(c){c.innerHTML=`<div id="vJobs" style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;"></div><div class="viz-label">Time Slots</div><div id="vSlots" style="display:flex;gap:5px;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Total Profit</div><div class="tbox-val" id="tvPr">0</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vJobs").innerHTML=s.jobs.map(j=>`<div style="padding:4px 8px;border-radius:6px;border:1px solid var(--border2);font-family:var(--mono);font-size:0.72rem;color:var(--text2);">${j.id}(d=${j.d},p=${j.p})</div>`).join("");document.getElementById("vSlots").innerHTML=s.slots.slice(1).map((v,i)=>`<div class="cell ${v?"found":""}" style="animation:none;width:48px;height:48px;font-size:0.8rem;"><span class="ci">t${i+1}</span>${v||"—"}</div>`).join("");document.getElementById("tvPr").textContent=s.profit;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  fractionalKnapsack:{
    title:"Fractional Knapsack — Greedy",
    desc:"Sort by value/weight ratio (descending). Take as much as possible of highest-ratio items first. Can take fractions.",
    init:{items:[{w:10,v:60},{w:20,v:100},{w:30,v:120}],W:50},
    run(p){const{items,W}=p||{items:[{w:10,v:60},{w:20,v:100},{w:30,v:120}],W:50};const sorted=[...items].map((it,i)=>({...it,r:it.v/it.w,i})).sort((a,b)=>b.r-a.r);let cap=W,profit=0;const fracs=[];const steps=[{sorted,fracs:[],profit,cap,note:`Sorted by v/w ratio. Capacity=${W}.`,type:"info"}];
      for(const it of sorted){if(cap<=0)break;const take=Math.min(it.w,cap);const gain=take*(it.v/it.w);cap-=take;profit+=gain;fracs.push({i:it.i,take,gain:+gain.toFixed(2)});steps.push({sorted,fracs:[...fracs],profit:+profit.toFixed(2),cap:+cap.toFixed(2),note:`Item(w=${it.w},v=${it.v},r=${it.r.toFixed(1)}): take ${take}kg → gain=${gain.toFixed(2)}. profit=${profit.toFixed(2)}`,type:"success"});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Max value = ${profit.toFixed(2)}`;return steps;},
    render(c){c.innerHTML=`<div id="vIt" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;"></div><div class="trackers"><div class="tbox green"><div class="tbox-label">Max Value</div><div class="tbox-val" id="tvV">0</div></div><div class="tbox blue"><div class="tbox-label">Capacity Left</div><div class="tbox-val" id="tvC">—</div></div></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vIt").innerHTML=s.sorted.map((it,k)=>{const f=s.fracs.find(fr=>fr.i===it.i);return`<div style="padding:6px 10px;border-radius:8px;border:2px solid ${f?"var(--green)":"var(--border2)"};font-family:var(--mono);font-size:0.72rem;color:${f?"var(--green-light)":"var(--text2)"};">w=${it.w},v=${it.v},r=${it.r.toFixed(1)}${f?`<br>take=${f.take}kg`:""}</div>`;}).join("");document.getElementById("tvV").textContent=s.profit;document.getElementById("tvC").textContent=s.cap;addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },

  huffmanCoding:{
    title:"Huffman Encoding — Greedy",
    desc:"Build min-heap of character frequencies. Repeatedly merge two lowest-frequency nodes. Result: shorter codes for frequent chars.",
    init:{chars:["a","b","c","d","e","f"],freq:[5,9,12,13,16,45]},
    run(p){const{chars,freq}=p||{chars:["a","b","c","d","e","f"],freq:[5,9,12,13,16,45]};let heap=chars.map((c,i)=>({c,f:freq[i],label:`${c}:${freq[i]}`})).sort((a,b)=>a.f-b.f);const steps=[{heap:[...heap],merged:[],note:`Init heap with ${chars.length} nodes, sorted by freq.`,type:"info"}];
      const merged=[];while(heap.length>1){const a=heap.shift(),b=heap.shift();const node={c:`(${a.c}+${b.c})`,f:a.f+b.f,left:a,right:b,label:`${a.f+b.f}`};heap.push(node);heap.sort((x,y)=>x.f-y.f);merged.push({a:a.label,b:b.label,sum:node.f});steps.push({heap:heap.map(n=>({...n,label:n.label})),merged:[...merged],note:`Merge ${a.label} + ${b.label} = ${node.f}`,type:"success"});}
      steps[steps.length-1].done=true;steps[steps.length-1].note=`✦ Huffman tree built! Root freq=${heap[0]&&heap[0].f}. Frequent chars get shorter codes.`;return steps;},
    render(c){c.innerHTML=`<div class="viz-label">Min-Heap (sorted nodes)</div><div id="vHeap" style="display:flex;gap:5px;flex-wrap:wrap;margin:8px 0;min-height:40px;"></div><div class="viz-label">Merge History</div><div id="vMrg" style="display:flex;flex-direction:column;gap:4px;margin:8px 0;"></div><div class="step-log" id="vLog"></div>`;},
    update(s){document.getElementById("vHeap").innerHTML=s.heap.map(n=>`<div style="padding:5px 10px;border-radius:7px;border:2px solid var(--accent);font-family:var(--mono);font-size:0.75rem;color:var(--accent-light);background:rgba(124,58,237,0.07);">${n.label}</div>`).join("");document.getElementById("vMrg").innerHTML=s.merged.map(m=>`<div style="font-family:var(--mono);font-size:0.72rem;color:var(--text2);">→ ${m.a} + ${m.b} = <span style="color:var(--green-light);font-weight:600;">${m.sum}</span></div>`).join("");addLogLine("vLog",s.note,s.type==="success"?"success":"info");}
  },
};

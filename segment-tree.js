function dummySegmentTree(array, fn, N) {
  return function (from, to) {
    let result = N;

    for (let i = from; i < to; i++) {
      result = fn(result, array[i]);
    }

    return result;
  }
}

function segmentTree(array, fn, N) {
  if (array.length == 0) return neutralTree(N);

  //Инициация массива хранения дерева
  const MAX_N = array.length;
  let tree = new Array(MAX_N * 4);

  for (let i = 0; i < tree.length; i++) {
    tree[i] = N;
  }

  //Инициация функции построения
  function build(arr, v, tl, tr) {
    if (tl == tr) {
      tree[v] = arr[tl];
    } else {

      let tm = parseInt((tl + tr) / 2);

      build(arr, v*2, tl, tm);
      build(arr, v*2+1, tm+1, tr);

      tree[v] = fn(tree[v*2], tree[v*2+1]);
    }
  }

  build(array, 1, 0, MAX_N-1);

  //Возвращаемая функция
  return function (from, to) {
    if (from > to) throw new Error ('Правый индекс больше левого.');

    function request (v, tl, tr, l, r) {
      if (l > r) return N;
      if (l == tl && r == tr) return tree[v];

      let tm = parseInt((tl + tr) / 2);

      let argument1 = request(v*2, tl, tm, l, Math.min(r, tm));
      let argument2 = request(v*2+1, tm+1, tr, Math.max(l, tm+1), r);

      return fn(argument1, argument2);
    }

    return request(1, 0, MAX_N-1, from, to-1);
  }  
};

function recursiveSegmentTree(array, fn, N) {
  //как определить размерность входящего массива?

  //инициализация по Х
  const MAX_N = array.length;
  let tree = new Array(MAX_N * 4);
  let MAX_M = array[0].length;
  for (let i = 0; i < tree.length; i++) {
    tree[i] = new Array(MAX_M * 4);
    for (let j = 0; j < tree[i].length; j++) {
      tree[i][j] = N;
    }
  }

  
  //построение по вторым индексам
  function buildY (vx, lx, rx, vy, ly, ry) {
    if (ly == ry) {
      if (lx == rx) tree[vx][vy] = array[lx][ly];
      else tree[vx][vy] = fn(tree[vx*2][vy], tree[vx*2+1][vy]);
    } else {
      let my = parseInt((ly + ry) / 2);
    
      buildY (vx, lx, rx, vy*2, ly, my);
      buildY (vx, lx, rx, vy*2+1, my+1, ry);

      tree[vx][vy] = fn(tree[vx][vy*2], tree[vx][vy*2+1]);
    }
  }

  //построение по первым индексам
  function buildX (vx, lx, rx) {
    if (lx != rx) {
     let mx = parseInt((lx + rx) / 2);
     buildX(vx*2, lx, mx);
     buildX(vx*2+1, mx+1, rx);
    }

    buildY(vx, lx, rx, 1, 0, MAX_M-1);
  }

  buildX (1, 0, MAX_N - 1);

  //как реализовать запрос?
  return function (fromX, toX) {
    return function (fromY, toY) {
      function requestY (vx, vy, tly, try_, ly, ry) {
        if (ly > ry) return N;
        if (ly == tly && try_ == ry) return tree[vx][vy];

        let tmy = parseInt((tly + try_) / 2);

        let argument1 = (vx, vy*2, tly, tmy, ly, Math.min(ry, tmy));
        let argument2 = (vx, vy*2+1, tmy+1, try_, Math.max(ly, tmy+1), ry);

        return fn(argument1, argument2);
      }

      function requestX (vx, tlx, trx, lx, rx, ly, ry) {
        let MAX_M = array[0].length;

        if (lx > rx) return N;
        if (lx == tlx && trx == rx) return requestY (vx, 1, 0, MAX_M-1, ly, ry);

        let tmx = parseInt((tlx + trx) / 2);

        let argument1 = requestX (vx*2, tlx, tmx, lx, Math.min(rx, tmx), ly, ry);
        let argument2 = requestX (vx*2+1, tmx+1, trx, Math.max(lx, tmx+1), rx, ly, ry);
        return fn(argument1, argument2);
      }

      return requestX (1, 0, MAX_N-1, fromX, toX-1, fromY, toY-1);
    }
  }
  // return segmentTree(array, fn, N);
}

function getElfTree(array) {
  return recursiveSegmentTree(array, sum, 0);
}

function assignEqually(tree, wishes, stash, elves, gems, week) {
  return {};
}

function assignAtLeastOne(tree, wishes, stash, elves, gems, week) {
  return {};
}

function assignPreferredGems(tree, wishes, stash, elves, gems) {
  return {};
}

function nextState(state, assignment, elves, gems) {
  return state;
}
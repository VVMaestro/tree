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
  let tree = [];

  function build(arr, v, tl, tr) {
    if (tl == tr) {
      tree[v] = arr[tl];
    } else {
      let tm = (tl + tr) / 2;
      build(arr, v * 2, tl, tm);
      build(arr, v * 2 + 1, tm + 1, tr);
      tree[v] = fn(tree[v * 2], tree[v * 2 + 1]);
    }
  }

  build(array, 1, 0, array.length - 1);

  return function (from, to) {
    function sum (v, tl, tr, l, r) {
      if (l > r) return 0;
      if (l == tl && r == tr) return tree[v];

      let tm = (tl + tr) / 2;
      return sum (v * 2, tl, tm, l, tm) + sum (v * 2 + 1, tm + 1, tr, tm, r);
    }

    return sum (1, 0, tree.length - 1, from, to);
  }

  return neutralTree(N);
};

function recursiveSegmentTree(array, fn, N) {
  return segmentTree(array, fn, N);
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
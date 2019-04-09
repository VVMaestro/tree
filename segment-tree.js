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
  function doubleSegmentTree () {
    //инициализация по Х
    const MAX_N = array.length;
    let tree = new Array(MAX_N * 4);

    //инициализация по Y    
    let MAX_M = array[0].length;
    for (let i = 0; i < tree.length; i++) {
      tree[i] = new Array(MAX_M * 4);
      for (let j = 0; j < tree[i].length; j++) {
        tree[i][j] = N;
      }
    }

    //построение по вторым индексам
    function buildY(vx, lx, rx, vy, ly, ry) {
      
      if (ly == ry) {

        if (lx == rx) {
          tree[vx][vy] = array[lx][ly];
        } else tree[vx][vy] = fn(tree[vx * 2][vy], tree[vx * 2 + 1][vy]);

      } else {
        let my = parseInt((ly + ry) / 2);

        buildY(vx, lx, rx, vy * 2, ly, my);
        buildY(vx, lx, rx, vy * 2 + 1, my + 1, ry);

        tree[vx][vy] = fn(tree[vx][vy * 2], tree[vx][vy * 2 + 1]);
      }
    }

    //построение по первым индексам
    function buildX(vx, lx, rx) {
      if (lx != rx) {
        let mx = parseInt((lx + rx) / 2);
        buildX(vx * 2, lx, mx);
        buildX(vx * 2 + 1, mx + 1, rx);
      }

      buildY(vx, lx, rx, 1, 0, MAX_M - 1);
    }

    buildX(1, 0, MAX_N - 1);

    return function (fromX, toX) {
      return function (fromY, toY) {
        function requestY(vx, vy, tly, try_, ly, ry) {
          if (ly > ry) return N;
          if (ly == tly && try_ == ry) return tree[vx][vy];

          let tmy = parseInt((tly + try_) / 2);

          let argument1 = requestY(vx, vy * 2, tly, tmy, ly, Math.min(ry, tmy));
          let argument2 = requestY(vx, vy * 2 + 1, tmy + 1, try_, Math.max(ly, tmy + 1), ry);

          return fn(argument1, argument2);
        }

        function requestX(vx, tlx, trx, lx, rx, ly, ry) {
          if (lx > rx) return N;
          if (lx == tlx && trx == rx) return requestY(vx, 1, 0, MAX_M - 1, ly, ry);

          let tmx = parseInt((tlx + trx) / 2);

          let argument1 = requestX(vx * 2, tlx, tmx, lx, Math.min(rx, tmx), ly, ry);
          let argument2 = requestX(vx * 2 + 1, tmx + 1, trx, Math.max(lx, tmx + 1), rx, ly, ry);

          return fn(argument1, argument2);
        }

        return requestX(1, 0, MAX_N - 1, fromX, toX - 1, fromY, toY - 1);
      }
    }
  }

  function tripleSegmentTree () {
    //инициализация по Х
    const MAX_N = array.length;    
    let tree = new Array(MAX_N * 4);    

    let MAX_M = array[0].length;
    let MAX_Q = array[0][0].length;
    if (MAX_Q == 0) MAX_Q = 1; //если массив state - пустой, gems первой недели приравниваем к нулю

    //инициализация по Y
    for (let i = 0; i < tree.length; i++) {
      tree[i] = new Array(MAX_M * 4);

      //инициализация по Z
      for (let j = 0; j < tree[i].length; j++) {
        tree[i][j] = new Array(MAX_Q * 4);
        
        for (let k = 0; k < tree[i][j].length; k++) {
          tree[i][j][k] = N;
        }              
      }
    }

    //построение по третьим индексам
    function buildZ(vx, lx, rx, vy, ly, ry, vz, lz, rz) {
      if (lz == rz) {

        if (lx == rx && ly == ry) {          
          tree[vx][vy][vz] = array[lx][ly][lz];
        } else if (lx == rx && ly != ry) {
          tree[vx][vy][vz] = fn(tree[vx][vy * 2][vz], tree[vx][vy * 2 + 1][vz]);
        } else if (lx != rx && ly == ry) {
          tree[vx][vy][vz] = fn(tree[vx * 2][vy][vz], tree[vx * 2 + 1][vy][vz]);
        } else if (lx != rx && ly != ry) {
          tree[vx][vy][vz] = fn(fn(tree[vx * 2][vy * 2][vz], tree[vx * 2 + 1][vy * 2][vz]),
            fn(tree[vx * 2][vy * 2 + 1][vz], tree[vx * 2 + 1][vy * 2 + 1][vz]));
        }

      } else {
        let mz = parseInt((lz + rz) / 2);

        buildZ(vx, lx, rx, vy, ly, ry, vz * 2, lz, mz);
        buildZ(vx, lx, rx, vy, ly, ry, vz * 2 + 1, mz + 1, rz);

        tree[vx][vy][vz] = fn(tree[vx][vy][vz * 2], tree[vx][vy][vz * 2 + 1]);
      }
    }
    
    //построение по вторым индексам
    function buildY(vx, lx, rx, vy, ly, ry) {
      if (ly != ry) {
        let my = parseInt((ly + ry) / 2);
        buildY(vx, lx, rx, vy * 2, ly, my);
        buildY(vx, lx, rx, vy * 2 + 1, my + 1, ry);
      }

      buildZ(vx, lx, rx, vy, ly, ry, 1, 0, MAX_Q - 1);
    }

    //построение по первым индексам
    function buildX(vx, lx, rx) {
      if (lx != rx) {
        let mx = parseInt((lx + rx) / 2);
        buildX(vx * 2, lx, mx);
        buildX(vx * 2 + 1, mx + 1, rx);
      }

      buildY(vx, lx, rx, 1, 0, MAX_M - 1);
    }

    buildX(1, 0, MAX_N - 1);
    
    return function (fromX, toX) {
      return function (fromY, toY) {
        return function (fromZ, toZ) {

          function requestZ(vx, vy, vz, tlz, trz, lz, rz) {
            if (lz > rz) return N;
            if (lz == tlz && trz == rz) {
              return tree[vx][vy][vz];
            }
            
            let tmz = parseInt((tlz + trz) / 2);
            
            let argument1 = requestZ(vx, vy, vz * 2, tlz, tmz, lz, Math.min(rz, tmz));
            let argument2 = requestZ(vx, vy, vz * 2 + 1, tmz + 1, rz, Math.max(lz, tmz + 1), rz);

            return fn(argument1, argument2);
          }
          
          function requestY(vx, vy, tly, try_, ly, ry, lz, rz) {
            if (ly > ry) return N;
            if (ly == tly && try_ == ry) {
              return requestZ(vx, vy, 1, 0, MAX_Q - 1, lz, rz);
            }

            let tmy = parseInt((tly + try_) / 2);

            let argument1 = requestY(vx, vy * 2, tly, tmy, ly, Math.min(ry, tmy), lz, rz);
            let argument2 = requestY(vx, vy * 2 + 1, tmy + 1, try_, Math.max(ly, tmy + 1), ry, lz, rz);

            return fn(argument1, argument2);
          }

          function requestX(vx, tlx, trx, lx, rx, ly, ry, lz, rz) {
            if (lx > rx) return N;
            if (lx == tlx && trx == rx) {
              return requestY(vx, 1, 0, MAX_M - 1, ly, ry, lz, rz);
            }

            let tmx = parseInt((tlx + trx) / 2);

            let argument1 = requestX(vx * 2, tlx, tmx, lx, Math.min(rx, tmx), ly, ry, lz, rz);
            let argument2 = requestX(vx * 2 + 1, tmx + 1, trx, Math.max(lx, tmx + 1), rx, ly, ry, lz, rz);

            return fn(argument1, argument2);
          }
          
          return requestX(1, 0, MAX_N - 1, fromX, toX - 1, fromY, toY - 1, fromZ, toZ - 1);
        }
      }
    }
  }
  
  if (Array.isArray(array[0][0])) {
    return tripleSegmentTree();
  } else if (Array.isArray(array[0])) {
    return doubleSegmentTree();
  } else {
    return segmentTree(array, fn, N);
  }
}

function getElfTree(array) {
  return recursiveSegmentTree(array, sum, 0);
}

function giveGemToElf (elf, gem, assignment) {
  if (!assignment[elf]) assignment[elf] = {};
  if (!assignment[elf][gem]) {
    assignment[elf][gem] = 1;
  } else assignment[elf][gem]++;
}

function assignEqually(tree, wishes, stash, elves, gems, week) {
  const assignment = {};
  const elvesToRating = {};
  const elvesForAssign = elves.map((elf) => elf);

  function findElfForGem (elves, ratingSystem) {
    let elfForGem;
    let rating = Number.MAX_VALUE;

    for (let i = 0; i < elves.length; i++) {
      if (ratingSystem[elves[i]] < rating) {
        rating = ratingSystem[elves[i]];
        elfForGem = elves[i];
      }
    }

    return elfForGem;
  }

  for (let i = 0; i < elves.length; i++) {
    console.log(elves.length + ' - ' + i);
    elvesToRating[elvesForAssign[i]] = tree(i, i+1)(0, gems.length)(0, week);
  } 

  for (gem in stash) {
    for (let i = 0; i < stash[gem]; i++) {
      let elfForGem = findElfForGem(elvesForAssign, elvesToRating);

      giveGemToElf(elfForGem, gem, assignment);

      elvesToRating[elfForGem]++;
    }
  }

  return assignment;
}

function assignAtLeastOne(tree, wishes, stash, elves, gems, week) {
  const assignment = {};
  const elvesForAssign = elves.map((elf) => elf);
  
  let elfCounter = 0;
  for (gem in stash) {
    for (let i = 0; i < stash[gem]; i++) {
      let elfForGem = elvesForAssign[elfCounter];

      giveGemToElf(elfForGem, gem, assignment);

      elfCounter++;
    }
  }

  return assignment;
}

function assignPreferredGems(tree, wishes, stash, elves, gems) {
  const assignment = {};
  let elvesToRating = {};
  const elvesForAssign = elves.map((elf) => elf);

  function rebuildRating (rating, gem, gems) {
    rating = {};
    let gemIndex = gems.indexOf(gem, 0);

    for (let i = 0; i < elves.length; i++) {
      rating[elvesForAssign[i]] = wishes[i][gemIndex];
    }

    return rating;
  }

  function findElfForGem(elves, ratingSystem) {
    let elfForGem;
    let rating = 0;

    for (let i = 0; i < elves.length; i++) {
      if (ratingSystem[elves[i]] > rating) {
        rating = ratingSystem[elves[i]];
        elfForGem = elves[i];
      }
    }

    return elfForGem;
  }

  for (gem in stash) {
    elvesToRating = rebuildRating(elvesToRating, gem, gems);

    for (let i = 0; i < stash[gem]; i++) {
      let elfForGem = findElfForGem(elvesForAssign, elvesToRating);

      giveGemToElf(elfForGem, gem, assignment);
    }
  }

  return assignment;
}

function nextState(state, assignment, elves, gems) {
  for (let i = 0; i < elves.length; i++) {
    for (let j = 0; j < gems.length; j++) {
      let gemsForWeek;

      if (assignment[elves[i]]) {
        gemsForWeek = assignment[elves[i]][gems[j]];
      } else gemsForWeek = false;
      
      if (gemsForWeek) {
        state[i][j].push(gemsForWeek);
      } else state[i][j].push(0);
    }
  }

  return state;
}
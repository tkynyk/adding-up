'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]); //文字列としての100を数値の100にかえてくれる。計算可能
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010){
            value.popu10 += popu;
        }
        if (year === 2015){
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () =>{
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10; //変化率の計算は、その県のデータが揃ったあと
    }
    const rankingArray = Array.from(map).sort((pair1,pair2)=> {
        return pair2[1].change - pair1[1].change; //正0負によって入れ替え
    });
    const rankingStrings = rankingArray.map((pair, i) => { //map関数　≠　連想配列のMap
        return (i + 1)+ '位 ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
        //配列番号0から=>+1
    });
    console.log(rankingStrings);
});
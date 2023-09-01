import async from 'async';

const items = [1,2,3,4,5,6];

const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

function callBack(error, results){
    if(error){
        console.log(`Error: ${error.message}`);
    }else{
        console.log("All items processed: ", results);
    }
}

// Iterator
const itemProduct = async (item) => {
    await delay(1000);
    console.log(`${item} * 2 = ${item * 2}`);
    return item * 2;
};


/** 
 * USING ASYNC/AWAIT
 */
// (async() => {
//     try {
//         let results = await async.mapSeries(items, itemProduct);
//         console.log("All items processed: ", results);
//     } catch (error) {
//         console.log(`Error: ${error.message}`);
//     }   
// })();

/**
 * USING CALLBACK
 */
async.mapSeries(items, itemProduct, callBack);
function random_binary_search(arr, item){
    if (arr.length < 1) {
        return None } 
    let begin = 0;
    let end = arr.length - 1;
    while (begin < end) {
        let midpoint = begin + Math.floor(((end-begin)/2));
        let val = arr[midpoint];
        if (val === item) {
            return midpoint }
        else if (val < item) {
            end = midpoint - 1;

        }
        else {
            begin = midpoint + 1;
        }
    }
    return None

}

console.log(random_binary_search([1, 5, 6, 8, 2], 6))
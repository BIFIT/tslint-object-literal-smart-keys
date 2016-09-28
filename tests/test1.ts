type X = {
    type: string;
    val: number;
}

(): X => {
    return {
        type: '',
        val: 1
    }
}

// const x: X = {
//     val: 1,
//     type: ''
// };

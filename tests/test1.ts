type X = {
    type: string;
    val: number;
}

function get(): X {
    return {
        type: 'x',
        val: 10
    };
}
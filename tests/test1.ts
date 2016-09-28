type X = {
    type: string;
    val: number;
}

const x = {
    val: 1,
    type: ""
}

export const fn = (): X => {
    return {
        val: 1,
        type: "",
    };
};

function call(x: X) {
    console.log(x);
}

call({
    val: 1,
    type: ""
})

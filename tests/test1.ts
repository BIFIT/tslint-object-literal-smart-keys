type X = {
    type: string;
    val: number;
}

// object-literal-smart-keys
const x: X = {
    val: 1,
    type: ""
};

export const fn = (x: X): X => {
    // object-literal-smart-keys
    return {
        val: x.val,
        type: x.type,
    };
};

// object-literal-smart-keys
fn({
    val: 1,
    type: ""
});

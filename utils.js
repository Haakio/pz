export function changeDimension(dimension, dimensions, callback) {
    if (dimensions[dimension]) {
        currentDimension = dimension;
        document.body.style.background = dimensions[dimension].background;
        document.body.style.color = dimensions[dimension].color;
        clickMultiplier *= dimensions[dimension].boost;
        document.body.classList.add('fade-transition');
        setTimeout(() => {
            document.body.classList.remove('fade-transition');
        }, 1000);
        callback();
    }
}

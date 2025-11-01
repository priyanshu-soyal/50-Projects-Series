// idea: first way :-
// function wrapAsync(fn) {
//     return function(req, res, next) {
//         fn(req, res, next).catch((err) => next(err))
//     }
// }

// idea: Second way :-
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}
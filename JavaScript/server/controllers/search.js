

function seach(req){
    text = req.text;
    result = [];
    text.array.forEach(word => {
        
        result.push(getResultFromPost(word).slice(0, 10));
        


    });
}
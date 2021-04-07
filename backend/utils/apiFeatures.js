class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    /*gets the keyword and creates the search query --> name:{$regex: keyword, $options: 'i'}*/
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }: {}

        this.query = this.query.find({...keyword});
        return this;
    }

    /*filter by price, type etc*/
    filter(){
        const queryCopy = {...this.queryStr};

        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);

        //filter for price, rating, description etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`) /* \b is used to match begining and end of a word*/

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    /*if query string has page no, takes page no as input and returns the response of the corresponding page.  Else first N records are returned*/
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;
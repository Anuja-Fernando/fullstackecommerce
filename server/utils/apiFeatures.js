class APIFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {};

        this.query.find({...keyword})
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };

        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);

        // ✅ Manually convert 'price[gte]' => { price: { $gte: value } }
        const transformed = {};
        for (let key in queryStrCopy) {
            const match = key.match(/^(\w+)\[(\w+)\]$/);
            if (match) {
                const field = match[1];      // e.g. 'price'
                const operator = match[2];   // e.g. 'gte'
                if (!transformed[field]) transformed[field] = {};
                transformed[field][`$${operator}`] = queryStrCopy[key];
            } else {
                transformed[key] = queryStrCopy[key];
            }
        }

        console.log("Transformed query:", JSON.stringify(transformed));
        this.query = this.query.find(transformed);
        return this;
    }

    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage-1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;
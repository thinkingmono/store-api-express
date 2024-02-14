const Product = require('../models/product')

//Static data testing controller
const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ price: { $gt: 30, $lt: 100 } }).sort('price').select('name price')
    res.status(200).json({ products, nbHits: products.length })
}

//Controller to get products from data base based in query criteria
const getAllProducts = async (req, res) => {
    //Destructure request query values.
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    //query object wich is gonna stored selected look for products query criteria.
    const queryObject = {};
    //If there is a featured value define in request query store it as a new key value into queryObject.
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }

    //If there is a company value define in request query store it as a new key value into queryObject.
    if (company) {
        queryObject.company = company;
    }

    //If there is a name value define in request query store it as a new key value into queryObject. Use mongodb regex and options to allow look for name in any part of product name.
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }

    // console.log(numericFilters);
    //Enable filter by price and rating
    if (numericFilters) {
        //Object wich stores mongodb operators in concordance with comparator operators.
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        //Regex expression.
        const regEx = /\b(>|>=|=|<|<=)\b/g
        //Filters string build replacing regular comparative operators with mongodb operators.
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        // console.log(filters);
        //Array with numeric filters available.
        const options = ['price', 'rating'];
        //Split filters string by comma, then split every segment by hyppen and store every part into field, operator and value const. Add object (with field, operator and value) into queryObject
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }

    // console.log(queryObject);
    //Bring all products based in previous criteria using Product mongoose model his find method.
    let result = Product.find(queryObject);
    //If there is a sort value define in request query.
    if (sort) {
        //Split sort string by comma and join result segments with inbetween space.
        const sortList = sort.split(',').join(' ');
        //Update result array with products sorted by sortedList criteria.
        result = result.sort(sortList);
    } else {
        //Update array sorted by product creation date.
        result = result.sort('createdAt')
    }

    //If there is a fields value define in request query.
    if (fields) {
        //Split fields string by comma and join result segments with inbetween space.
        const fieldList = fields.split(',').join(' ')
        //Update result array with products show only fields in fieldList.
        result = result.select(fieldList)
    }

    //Capture page value from query or define it as 1
    const page = Number(req.query.page) || 1;
    //Capture limit value from query or define it as 10 products
    const limit = Number(req.query.limit) || 10;
    //Set products to skip (to show correspondig products in determine page) based in page number and limit values.
    const skip = (page - 1) * limit;

    //Update result products setting products to skip and limit to show.
    result = result.skip(skip).limit(limit);

    //Set products with result after defining all available filters and queries.
    const products = await result
    //Send json with products queried and total products result.
    res.status(200).json({ products, nbHits: products.length });
}

module.exports = { getAllProductsStatic, getAllProducts }
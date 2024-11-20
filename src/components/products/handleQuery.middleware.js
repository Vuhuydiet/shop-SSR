const handleQuery = (req, res, next) => {
    const { query } = req;
  
    req.query = {
      category: query.category || null,
      brand: query.brand || '',
      postedAfter: query.postedAfter || null,
      postedBefore: query.postedBefore || null,
      minPrice: query.minPrice || 0,
      maxPrice: query.maxPrice || Infinity,
      minQuantity: query.minQuantity || 0,
      maxQuantity: query.maxQuantity || Infinity,
      sortBy: query.sortBy || '',
      order: query.order || 'asc',
      offset: query.offset || 0,
      limit: query.limit || 10,
    };
  
    next();
  };
  
  export default handleQuery;
  
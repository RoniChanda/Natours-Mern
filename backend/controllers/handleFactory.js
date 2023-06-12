const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

// ******************************* Get model name ************************************
const modelName = (Model) => Model.collection.modelName.toLowerCase();

// ******************************* Get All docs ************************************
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: "SUCCESS",
      results: docs.length,
      data: {
        [`${modelName(Model)}s`]: docs,
      },
    });
  });

// ******************************* Get doc By Id ************************************
exports.getById = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`No ${modelName(Model)} found with the provided ID`, 404)
      );
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        [modelName(Model)]: doc,
      },
    });
  });

// ******************************* Create doc ************************************
exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "SUCCESS",
      data: {
        [modelName(Model)]: newDoc,
      },
    });
  });

// ******************************* Update doc By Id ************************************
exports.updateById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(
        new AppError(`No ${modelName(Model)} found with the provided ID`, 404)
      );
    }

    doc.set(req.body);
    await doc.save({ validateModifiedOnly: true });

    res.status(200).json({
      status: "SUCCESS",
      data: {
        [modelName(Model)]: doc,
      },
    });
  });

// ******************************* Delete doc By Id ************************************
exports.deleteById = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No ${modelName(Model)} found with the provided ID`, 404)
      );
    }

    res.status(204).json({
      status: "SUCCESS",
      data: null,
    });
  });

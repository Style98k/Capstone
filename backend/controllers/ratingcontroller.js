import Ratings from "../models/ratingmodel.js";

const RatingController = {
  getAll: (req, res) => {
    Ratings.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getByUser: (req, res) => {
    Ratings.getByUser(req.params.userId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  create: (req, res) => {
    Ratings.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Rating submitted!", id: result.insertId });
    });
  },

  delete: (req, res) => {
    Ratings.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Rating deleted!" });
    });
  }
};

export default RatingController;

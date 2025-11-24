import Gig from "../models/gigmodel.js";

const GigController = {
  getAllGigs: (req, res) => {
    Gig.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  createGig: (req, res) => {
    Gig.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Gig created!", id: result.insertId });
    });
  },

  getGig: (req, res) => {
    Gig.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]);
    });
  },

  updateGig: (req, res) => {
    Gig.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Gig updated!" });
    });
  },

  deleteGig: (req, res) => {
    Gig.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Gig deleted!" });
    });
  }
};

export default GigController;

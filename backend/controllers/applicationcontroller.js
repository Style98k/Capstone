import Applications from "../models/applicationmodel.js";

const ApplicationController = {
  getAll: (req, res) => {
    Applications.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  create: (req, res) => {
    Applications.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Application submitted!", id: result.insertId });
    });
  },

  getByGig: (req, res) => {
    Applications.getByGig(req.params.gigId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getByStudent: (req, res) => {
    Applications.getByStudent(req.params.studentId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  update: (req, res) => {
    Applications.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Application status updated!" });
    });
  },

  delete: (req, res) => {
    Applications.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Application deleted!" });
    });
  }
};

export default ApplicationController;

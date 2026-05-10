const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const db = require("../config/db");

const uploadImage = async (req, res) => {

    try {

        const imagePath = req.file.path;

        const formData = new FormData();

        formData.append(
            "image",
            fs.createReadStream(imagePath)
        );

        // AI API Call
        const response = await axios.post(
            "https://fatmachines.com/assignment/ai.php",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "X-Auth-Key":
                        "abcdefghijklmnop"
                }
            }
        );

        const outputUrl =
            response.data.output;

        // Insert into DB
        const sql =
            "INSERT INTO requests (image_url, output_url) VALUES (?, ?)";

        db.query(
            sql,
            [imagePath, outputUrl],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "DB insert failed"
                    });
                }

                res.json({
                    success: true,
                    image_url: imagePath,
                    output_url: outputUrl
                });

            }
        );

    } catch (error) {

        console.log(error.message);

        res.status(500).json({
            success: false,
            message: "AI API failed"
        });

    }

};

const getHistory = (req, res) => {

    const sql =
        "SELECT * FROM requests ORDER BY created_at DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false
            });
        }

        res.json({
            success: true,
            data: result
        });

    });

};

const deleteHistory = (req, res) => {

    const id = req.params.id;

    const sql =
        "DELETE FROM requests WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success:false
            });
        }

        res.json({
            success:true,
            message:"Deleted successfully"
        });

    });

};

module.exports = {
    uploadImage,
    getHistory,
    deleteHistory
};
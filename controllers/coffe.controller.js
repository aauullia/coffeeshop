const { coffe, order_detail} = require(`../models/index`);
const { Op } = require(`sequelize`);
const path = require(`path`);
const fs = require(`fs`);
const upload = require(`./uploud.images`).single(`image`);

exports.getAll = async (req, res) => {
  let cars = await coffe.findAll();
  return res.json({
    success: true,
    data: cars,
    message: `All coffe have been loaded`,
  });
};

exports.findCoffe = async (req, res) => {
  let keyword = req.params.key;
  let cars = await coffe.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: keyword } },
        { coffeID: { [Op.substring]: keyword } }
      ],
    },
  });
  return res.json({
    success: true,
    data: cars,
    message: `All coffe have been loaded`,
  });
};

exports.addCoffe = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.json({ message: error });
        }
        
        // Periksa apakah file telah diunggah
        if (!request.file) {
            return response.json({
                success: false,
                message: `No file uploaded. Please upload an image.`,
            });
        }

        // Validasi data masukan
        const { name, price, size } = request.body;
        
        if (!name || !price || !size) {
            return response.json({
                success: false,
                message: `Name, price, and size are required fields.`,
            });
        }

        // Buat data kopi baru
        const newCoffe = {
            name,
            price,
            size,
            image: request.file.filename,
        };

        try {
            // Simpan data kopi baru ke database
            const result = await coffe.create(newCoffe);
            
            return response.json({
                success: true,
                data: result,
                message: `New coffe has been inserted.`,
            });
        } catch (error) {
            return response.json({
                success: false,
                message: error.message,
            });
        }
    });
};

exports.updateCoffe = async (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    let carID = request.params.id;
    let dataEvent = {
        name: request.body.name,
        price: request.body.price,
        size: request.body.size,
        image: request.file.filename,
    };
    if (request.file) {
      const selectedEvent = await coffe.findOne({
        where: { coffeID: carID },
      });
      const oldImage = selectedEvent.image;
      const pathImage = path.join(__dirname, `../image`, oldImage);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => console.log(error));
      }
      dataEvent.image = request.file.filename;
    }
    coffe
      .update(dataEvent, { where: { coffeID: carID } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data coffe has been updated`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.deletecoffe = async (request, response) => {
    const coffeID = request.params.id;

    try {
        // Hapus detail pesanan terkait
        await order_detail.destroy({ where: { coffeID: coffeID } });
        console.log(`Hapus detail pesanan dengan coffeID: ${coffeID}`);

        // Hapus data kopi
        const event = await coffe.findOne({ where: { coffeID: coffeID } });
        const oldImage = event.image;

        // Hapus gambar
        const pathImage = path.join(__dirname, `../image`, oldImage);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
            console.log(`Hapus gambar: ${pathImage}`);
        }

        // Hapus kopi dari `coffes`
        await coffe.destroy({ where: { coffeID: coffeID } });
        console.log(`Hapus kopi dengan coffeID: ${coffeID}`);

        return response.json({
            success: true,
            message: `Data kopi dengan ID ${coffeID} telah dihapus`,
        });
    } catch (error) {
        console.error(`Kesalahan saat menghapus kopi dengan ID ${coffeID}:`, error);
        return response.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
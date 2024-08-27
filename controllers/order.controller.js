const { coffe, order_detail, order_list, sequelize } = require(`../models/index`);


exports.findAll = async (req, res) => {
    try {
      let orders = await order_list.findAll({
        include: [{
          model: order_detail,
          as: 'listCoffe',
          include:[coffe]
        }] //menyertakan order detail sesuai pesanan
      });
      return res.json({
        success: true,
        data: orders,
        message: 'Order list has been retrieved along with order details'
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  exports.addOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        console.log("Data permintaan:", req.body);

        const { customer_name, order_type, order_date, order_detail: orderDetailData } = req.body;

        if (!customer_name || !order_type || !order_date || !orderDetailData || !Array.isArray(orderDetailData)) {
            throw new Error("Data input tidak valid");
        }

        const orderList = await order_list.create({
            customer_name,
            order_type,
            order_date,
        }, { transaction: t });

        // Mencetak informasi pesanan yang baru dibuat
        console.log("Daftar pesanan:", orderList);

        for (const item of orderDetailData) {
            const { coffee_id, price, quantity } = item; // Mengambil informasi detail pesanan
            console.log("Membuat detail pesanan:", item);
            console.log("order_detail:", order_detail);

            // Periksa apakah order_detail.create adalah fungsi
            if (typeof order_detail.create !== 'function') {
                throw new Error("order_detail.create is not a function");
            }

            await order_detail.create({
                orderID: orderList.orderID,
                coffeID: coffee_id,
                price,
                quantity,
            }, { transaction: t });
        }

        await t.commit();

        res.status(201).json({
            data: {
                id: orderList.orderID,
                customer_name,
                order_type,
                order_date,
            },
            message: "Pesanan berhasil dibuat",
        });
    } catch (error) {
        await t.rollback();
        console.error("Kesalahan saat menambahkan pesanan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
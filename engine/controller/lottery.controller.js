const util = require('util')
const { connector } = require('../config/connector')
const query = util.promisify(connector.query).bind(connector)

module.exports = {

    checkLotteryNumber: async (yw, ir) => {

        try {

            const { store_number, transaction_number, amount } = yw.body

            if (!store_number || !transaction_number || !amount) {
                return ir.status(400).json({ response: 'Мэдээлэл буруу байна' });
            }

            const results = await query(
                "SELECT * FROM ebarimt.lottery WHERE store_number = ? AND transaction_number = ? AND amount = ? LIMIT 1",
                [store_number, transaction_number, amount]
            )

            if (results.length === 0) {
                return ir.status(404).json({ response: 'Мэдээлэл олдсонгүй' });
            }

            return ir.status(200).json({ response: results })
        }
        catch (error) {
            ir.status(500).json({ response: error.message })
        }
    },

    insertLotteryNumber: async (yw, ir) => {

        try {
            const { id, lottery_number } = yw.body;

            if (!id || !lottery_number) {
                return ir.status(400).json({ response: 'Мэдээлэл буруу байна' });
            }

            const lotteryRegex = /^[A-Za-z]{2}\d{6}$/;
            if (!lotteryRegex.test(lottery_number)) {
                return ir.status(400).json({ response: 'Сугалааны дугаарын формат буруу байна' });
            }

            const results = await query(
                "UPDATE ebarimt.lottery SET lottery_number = ? WHERE id = ?",
                [lottery_number, id]
            );

            if (results.affectedRows === 0) {
                return ir.status(404).json({ response: 'Мэдээлэл олдсонгүй' });
            }

            return ir.status(200).json({ response: 'Амжилттай хадгалагдлаа' });
        } catch (error) {
            ir.status(500).json({ response: error.message });
        }

    }
}
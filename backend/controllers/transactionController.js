import Transaction from "../models/transaction.model.js";

// @desc  Get all tranasctions of logged in user
// @route GET /api/v1/transactions
// @access Private
export const getTransactions = async (req, res, next) => {
  try {
    //Critial : We only find transactions where the 'user' field matches the logged-in user
    // This prevents to show user A the transactions of user B
    const transactions = await Transaction.find({ user: req.user.id });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc  Adds a transaction
// @route POST api/v1/transactions
// @access Private

const addTransaction = async (req, res, next) => {
  try {
    const { text, amount, category, type } = req.body;

    const newTransaction = await Transaction.create({
      text,
      amount,
      category,
      type,
      user: req.user.id,
    });

    return res.status(201).json({ sucess: true, data: newTransaction });
  } catch (error) {
    //mongoose valiation error handling
    if (error.name === `ValidationError`) {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        sucess: false,
        error: messages,
      });
    } else {
      return res.status(500).status({
        success: false,
        error: `Server Error`,
      });
    }
  }
};

//@desc   Delete transction
//@route  DELETE api/v1/tranaction/:id
//@access Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: `No trasaction found`,
      });
    }

    //SECURITY CHECK: Make sure user deleted the tranction actually owns it
    if (transaction.user.toString() !== req.params.id) {
      return res.status(401).json({
        success: false,
        error: `Not authorized to delete this transaction`,
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      sucess: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Server Error`,
    });
  }
};

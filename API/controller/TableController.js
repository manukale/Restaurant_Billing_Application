import Tables from "../model/Tables.js";

export const addTable = async (req, res) => {
    try {
        console.log(req.body);
        
        const { table_number, status,organization_id } = req.body;

        if (!table_number) {
            return res.status(400).json({ error: "table_number is required" });
        }

        const newTable = new Tables({
            table_number,
          status: status || "vacant",
            organization_id
        });

        await newTable.save();
        console.log(newTable);
        
        res.status(201).json(newTable);
    } catch (error) {
        console.error("Error adding table:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all organizations
export const getAllTables = async (req, res) => {
  try {
    const table = await Tables.find();
    res.status(200).json(table);
  } catch (error) {
      console.log('error::',error)
    res.status(500).send(error.message);
  }
};
// Delete organization
export const deleteTable = async (req, res) => {
  try {
    const table = await Tables.findByIdAndDelete(req.params.id);
    
    if (!table) {
      return res.status(404).send('Organization not found');
    }
    
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const updateTable = async (req, res) => {
  try {
    // const { name, firm_id } = req.body;
    const table_number = await Tables.findOne(
      {table_number : req.params.table_no},
    );
    const table = await Tables.findByIdAndUpdate(
      table_number._id,
      req.body,
      { new: true, runValidators: true }
    );
    
      if (!table) {
      return res.status(404).send('Table not exist');
    }
    
    res.status(200).json({data:table, success:true});
  } catch (error) {
    res.status(400).send(error.message);
  }
};
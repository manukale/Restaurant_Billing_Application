import Organization from '../model/Organization.js';

// Create organization

  export const createOrganization = async (req, res, next) => {
  try {
    const { name, firm_id } = req.body;
    const organization = new Organization({ name, firm_id });
    await organization.save();
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get all organizations
export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get organization by ID
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).send('Organization not found');
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update organization
export const updateOrganization = async (req, res) => {
  try {
    const { name, firm_id } = req.body;
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { name, firm_id },
      { new: true, runValidators: true }
    );
    
    if (!organization) {
      return res.status(404).send('Organization not found');
    }
    
    res.status(200).json(organization);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete organization
export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    
    if (!organization) {
      return res.status(404).send('Organization not found');
    }
    
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
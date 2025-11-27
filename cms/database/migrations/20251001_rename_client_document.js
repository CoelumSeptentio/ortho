module.exports = {
  async up(knex) {
    // Pakeisk tikrą lentelės pavadinimą, jei kitoks:
    const hasCol = await knex.schema.hasColumn('client_documents', 'document');
    if (hasCol) {
      await knex.schema.table('client_documents', (table) => {
        table.renameColumn('document', 'client_doc');
      });
    }
  },
  async down(knex) {
    const hasCol = await knex.schema.hasColumn('client_documents', 'client_doc');
    if (hasCol) {
      await knex.schema.table('client_documents', (table) => {
        table.renameColumn('client_doc', 'document');
      });
    }
  },
};


exports.up = function(knex, Promise) {
   return knex.schema.createTable('stocks', function(table){
       table.increments("stocks_id");
       table.integer('user_id').references('user_id').inTable('users');
       table.string('stock');

   });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('users');
};
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace MvcPlayground.Models
{
    public class StoreContext : DbContext
    {
        public StoreContext()
            : base("StoreContext")
        {
            this.Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Customer> CustomerSet { get; set; }
        public DbSet<Order> OrderSet { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
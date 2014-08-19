using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Reflection;
using System.Data.Entity.Infrastructure;

namespace MvcPlayground.Models
{
    public enum DryRun
    {
        On, Off
    }

    public class ComponentTable
    {
        public List<ComponentRow> rows { get; set; }
        public List<DataSource> dataSources { get; set; }
    }

    public class DataSource
    {
        public string Name { get; set; }
    }

    public class ComponentRow
    {
        public BoundRecordInfo record { get; set; }
        public List<component> components { get; set; }
    }

    public class TestCell : IReactComponent
    {
        public string text { get; set; }
    }

    public class BoundRecordInfo
    {
        public string entityClass { get; set; }
        public dynamic primaryKey { get; set; }

        public BoundRecordInfo()
        {
        }

        public BoundRecordInfo(object entity)
        {
            var entityType = entity.GetType();
            this.entityClass = entityType.Namespace + '.' + entityType.Name;

            var primaryKeyField = ((IObjectContextAdapter)new StoreContext())
                .ObjectContext
                .CreateObjectSet<Customer>()
                .EntitySet
                .ElementType
                .KeyMembers.First().Name;

            this.primaryKey = entity.GetType().GetProperty(primaryKeyField).GetValue(entity);
        }
    }

    public class recordUpdateRequest
    {
        public BoundRecordInfo boundRecord { get; set; }
        public string fieldToUpdate { get; set; }
        public dynamic newValue { get; set; }

        public dynamic Submit(DryRun dryRun = DryRun.Off)
        {
            var context = new StoreContext();
            var type = Type.GetType(boundRecord.entityClass);
            var entitySet = context.Set(type);
            var entity = entitySet.Find(boundRecord.primaryKey);
            context.Entry(entity);
            type.GetProperty(fieldToUpdate).SetValue(entity, newValue);

            if (dryRun == DryRun.Off)
            {
                var saveResult = context.SaveChanges();
                if (saveResult > 0)
                {
                    return boundRecord.primaryKey;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return this;
            }
        }
    }

    public interface IReactComponent
    {
    }

    public class TextBox : IReactComponent
    {
        public string value { get; set; }
        public string name { get; set; }
        public BoundRecordInfo boundRecord { get; set; }
    }

    public class ComboBox : IReactComponent
    {
        public string value { get; set; }
        public dynamic dataSource { get; set; }
        public BoundRecordInfo boundRecord { get; set; }
    }

    public class component
    {
        public string type { get; set; }
        public object props { get; set; }

        public component(object instance)
        {
            this.type = instance.GetType().Name;
            this.props = instance;
        }
    }
}
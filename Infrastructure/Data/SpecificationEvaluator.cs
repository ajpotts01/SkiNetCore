using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        private static IQueryable<TEntity> ApplyCriteria(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            var returnQuery = inputQuery;

            if (spec.Criteria != null)
            {
                returnQuery = returnQuery.Where(spec.Criteria);
            }

            return returnQuery;
        }
        
        private static IQueryable<TEntity> ApplyOrder(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            var returnQuery = inputQuery;

            if (spec.OrderBy != null)
            {
                returnQuery = returnQuery.OrderBy(spec.OrderBy);
            }

            if (spec.OrderByDescending != null)
            {
                returnQuery = returnQuery.OrderByDescending(spec.OrderByDescending);
            }            

            return returnQuery;
        }   

        private static IQueryable<TEntity> ApplyPaging(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            var returnQuery = inputQuery;

            if (spec.IsPagingEnabled)
            {
                returnQuery = returnQuery.Skip(spec.Skip)
                                         .Take(spec.Take);
            }

            return returnQuery;
        }

        private static IQueryable<TEntity> ApplyIncludes(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            var returnQuery = inputQuery;

            returnQuery = spec 
                          .Includes
                          .Aggregate(returnQuery, (current, include) => current.Include(include));

            return returnQuery;
        }             
        
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
        {
            var query = inputQuery;

            query = ApplyCriteria(query, spec);

            query = ApplyOrder(query, spec);

            query = ApplyPaging(query, spec);

            query = ApplyIncludes(query, spec);

            return query;
        }
    }
}
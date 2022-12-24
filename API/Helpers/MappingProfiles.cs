using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dto;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                        .ForMember(dto => dto.ProductBrand, 
                                    opt => opt.MapFrom(prod => prod.ProductBrand.Name))
                        .ForMember(dto => dto.ProductType,
                                    opt => opt.MapFrom(prod => prod.ProductType.Name))
                        .ForMember(dto => dto.PictureUrl,
                                    opt => opt.MapFrom<ProductUrlResolver>());
        }
    }
}
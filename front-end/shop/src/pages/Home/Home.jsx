import React, { useState, useCallback } from "react";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

import Container from "./Container";
import SectionHeader from "./SectionHeader";
import EventSection from "./EventSection/EventSection";
import ProductCard from "./ProductCard";
import HotProductSection from "./HotProductSection/HotProductSection";
import SearchResultSection from "./SearchResultSection/SearchResultSection";
import CategoryCard from "./CategoryCart";
import Header from "./Header";
import Footer from "./Footer";

const categories = [
  { id: 6, name: "Tất cả", value: "" },
  { id: 1, name: "Áo", value: "SHIRT" },
  { id: 2, name: "Quần", value: "PANTS" },
  { id: 3, name: "Váy/ Đầm", value: "DRESS" },
  { id: 4, name: "Đồ bộ", value: "SET" },
  { id: 5, name: "Thể thao", value: "SPORTWARE" },
  
];

export default function Home() {

  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);


  const onChoosingCategory = useCallback((e) => {
    setCategory(e.target.value);
    setIsSearching(true);
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50 text-slate-800">
      <Header
        keyword={keyword}
        setKeyword={setKeyword}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setIsSearching={setIsSearching}
      />

      <main className="pb-10">
        <Container className="pt-8">
          <section className="rounded-[2rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 p-6 text-white shadow-xl sm:p-10  flex flex-col justify-center items-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-black sm:text-5xl ">
                Lorem ipsum dolor sit amet.
              </h1>
              <p className="mt-4 text-sm leading-7 text-violet-50 sm:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, asperiores ducimus eos officia qui quae accusantium dolorum praesentium excepturi inventore, totam libero maxime ab itaque.
              </p>
            </div>
          </section>
        </Container>

        <Container className="mt-12">
          <SectionHeader title="Bạn đang quan tâm gì?" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => (
              <CategoryCard key={item.id} item={item} onChoosingCategoryFunc={onChoosingCategory}/>
            ))}
          </div>
        </Container>
        
        {
          isSearching ?  <SearchResultSection keyword={keyword} category={category} setIsSearching={setIsSearching}></SearchResultSection> : <></> 
        }
        <EventSection></EventSection>
        <HotProductSection></HotProductSection>
        <HotProductSection></HotProductSection>
        
      </main>

      <Footer />
    </div>
  );
}

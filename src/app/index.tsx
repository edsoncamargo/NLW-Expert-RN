import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";
import { Text, View, FlatList, SectionList } from "react-native";
import { CATEGORIES, MENU, ProductProps } from "@/utils/data/products";
import { useEffect, useRef, useState } from "react";
import { Product } from "@/components/product";
import { Link } from "expo-router";
import { useCartStore } from "@/stores/cart-store";

export default function Home() {
  const cartStore = useCartStore();
  const [currentCategory, setCurrentCategory] = useState<string>(CATEGORIES[0]);
  const eSectionListRef = useRef<SectionList<ProductProps>>(null);
  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  function updateCategory(category: string, index: any) {
    setCurrentCategory(category);

    if (eSectionListRef.current) {
      eSectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0,
      });
    }
  }

  useEffect(() => {}, [currentCategory]);

  return (
    <View className="flex-1 pt-8">
      <Header title="Menu" cartQuantity={cartQuantityItems} />
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <CategoryButton
            title={item}
            isSelected={currentCategory === item}
            onPress={() => updateCategory(item, index)}
          />
        )}
        horizontal
        className="h-full max-h-24 pt-5"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        ref={eSectionListRef}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-white font-heading my-4">{title}</Text>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="p-5"
      />
    </View>
  );
}

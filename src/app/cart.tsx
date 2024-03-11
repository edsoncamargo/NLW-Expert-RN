import { Header } from "@/components/header";
import { Alert, ScrollView, Text, View, Linking } from "react-native";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5511969920250";

export default function Cart() {
  const cartStore = useCartStore();
  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );
  const [address, setAddress] = useState("");
  const navigate = useNavigation();

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert(
      "Remove",
      `Do you want to remove the ${product.title} product?`,
      [
        { text: "Cancel" },
        { text: "Remove", onPress: () => cartStore.remove(product.id) },
      ]
    );
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Order", "Type order address, please.");
    }

    const products = cartStore.products
      .map(
        (product) =>
          `\n${product.quantity}x ${product.title} | R$ ${
            product.price * product.quantity
          } 💰`
      )
      .join("");

    const message = `NEW ORDER 🍔
    \nOrder in: ${address}

    \n====================
    ${products}
    \n====================

    \nTotal
    \n${total} 💰
    `;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );
    cartStore.clear();
    navigate.goBack();
  }

  return (
    <View className="flex-1 pt-8 mb-4">
      <Header title="Your cart" />

      <KeyboardAwareScrollView>
        <ScrollView className="flex-1 px-6 mt-4">
          {cartStore.products.length === 0 ? (
            <Text className="font-body text-slate-400 text-center my-8">
              Your cart is empty
            </Text>
          ) : (
            <View className="flex-1 border-b border-slate-700">
              {cartStore.products.map((product) => (
                <Product
                  key={product.id}
                  data={product}
                  onPress={() => handleProductRemove(product)}
                />
              ))}
            </View>
          )}

          <View className="gap-2 my-5 mb-8 justify-end items-end">
            <Text className="text-white text-xl font-subtitle">Total</Text>
            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
          </View>

          <Input
            placeholder="Type your address..."
            onChangeText={setAddress}
            blurOnSubmit={true}
            onSubmitEditing={handleOrder}
            returnKeyType="next"
          />
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Send request</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Back to menu" href="/"></LinkButton>
      </View>
    </View>
  );
}

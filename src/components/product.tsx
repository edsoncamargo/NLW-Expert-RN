import {
  Image,
  ImageProps,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { forwardRef } from "react";

type ProductDataProps = {
  title: string;
  description: string;
  thumbnail: ImageProps;
  quantity?: number;
};

type ProductProps = TouchableOpacityProps & {
  data: ProductDataProps;
};

export const Product = forwardRef<TouchableOpacity, ProductProps>(
  ({ data, ...rest }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className="w-full flex-row items-center pb-4"
        {...rest}
      >
        <Image source={data.thumbnail} className="w-20 h-20 rounded-md" />

        <View className="flex-1 ml-3">
          <View className="justify-between flex-row">
            <Text className="text-slate-100 font-subtitle text-base">
              {data.title}
            </Text>

            {data.quantity && (
              <Text className="text-slate-400 font-subtitle text-sm mb-2">
                x {data.quantity}
              </Text>
            )}
          </View>

          <Text className="text-slate-400 text-xs font-body leading-5">
            {data.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

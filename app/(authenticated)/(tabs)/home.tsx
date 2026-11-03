import Dropdown from "@/components/Dropdown";
import RoundButton from "@/components/RoundButton";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useBalanceStore } from "@/store/balanceStore";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Home = () => {
  const { balance, runTransaction, transactions, clearTransactions } =
    useBalanceStore();

  const onAddMoney = () => {
    let amount =
      Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1);
    runTransaction({
      id: Math.random().toString(),
      amount: amount,
      date: new Date(),
      title: amount > 0 ? "Deposit" : "Withdraw",
    });
  };
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>$</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundButton icon={"add"} text={"Add money"} onPress={onAddMoney} />
        <RoundButton
          icon={"refresh"}
          text={"Exchange"}
          onPress={clearTransactions}
        />
        <RoundButton icon={"list"} text={"Details"} onPress={onAddMoney} />
        <Dropdown />
      </View>

      {/* Transactions list */}
      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transactions.length === 0 && (
          <Text style={{ padding: 14, color: Colors.gray }}>
            No Transactions found
          </Text>
        )}
        {transactions
          ?.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          ?.map((transaction) => {
            return (
              <View
                key={transaction.id}
                style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
              >
                <View style={styles.circle}>
                  <Ionicons
                    name={transaction.amount > 0 ? "add" : "remove"}
                    size={24}
                    color={Colors.dark}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "900" }}>{transaction.title}</Text>
                  <Text style={{ color: Colors.gray, fontSize: 12 }}>
                    {transaction.date.toLocaleString()}
                  </Text>
                </View>
                <Text>$ {Math.abs(transaction.amount)}</Text>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 5,
  },
  balance: {
    fontSize: 50,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;

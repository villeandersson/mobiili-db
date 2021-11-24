import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("ostosdb.db");

export default function App() {
  const [maara, setMaara] = useState("");
  const [tuote, setTuote] = useState("");
  const [tuotteet, setTuotteet] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists tuotteet (id integer primary key not null, maara int, tuote text);"
      );
    });
    updateList();
  }, []);

  // Save course
  const saveItem = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into tuotteet (maara, tuote) values (?, ?);", [
          parseInt(maara),
          tuote,
        ]);
      },
      null,
      updateList
    );
  };

  // Update courselist
  const updateList = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from tuotteet;", [], (_, { rows }) =>
        setCourses(rows._array)
      );
    });
  };

  // Delete course
  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from tuotteet where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%",
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tuotteen nimi"
        style={{
          marginTop: 30,
          fontSize: 18,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(tuote) => setTuote(tuote)}
        value={tuote}
      />
      <TextInput
        placeholder="Määrä"
        keyboardType="numeric"
        style={{
          marginTop: 5,
          marginBottom: 5,
          fontSize: 18,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(maara) => setMaara(maara)}
        value={maara}
      />
      <Button onPress={saveItem} title="Lisää" />
      <Text style={{ marginTop: 30, fontSize: 20 }}>Ostoslista</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>
              {item.tuote}, {item.maara}
            </Text>
            <Text
              style={{ fontSize: 18, color: "#0000ff" }}
              onPress={() => deleteItem(item.id)}
            >
              {" "}
              Ostettu
            </Text>
          </View>
        )}
        data={courses}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },
});

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Message from "./src/components/message";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Message
        image="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        message="GitHub: @imnotvirus"
      />
      <Message
        image="https://logospng.org/download/linkedin/logo-linkedin-icon-256.png"
        message="/luizincode"
      />
      <Message image="http://github.com/imnotvirus.png" message="Obrigado!" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

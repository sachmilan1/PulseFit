import { StyleSheet } from "react-native";

export const THEME = {
  overlay: "rgba(0,0,0,0.6)",
  orange: "rgba(255, 140, 0, 0.92)",
  red: "rgba(229, 57, 53, 0.85)",
  glowBorder: "rgba(255,255,255,0.28)",
};

export default StyleSheet.create({
  // Screen background + overlay
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: THEME.overlay },

  // Fixed top header (Back + Home)
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  headerButton: {
    backgroundColor: THEME.orange,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  headerButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  // Use this in ScrollView contentContainerStyle so content starts below header
  contentBelowHeader: {
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Glowing card
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: THEME.glowBorder,

    // subtle glow
    shadowColor: "#ffffff",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },

  // Titles / text
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 14,
    textAlign: "center",
  },
  text: {
    color: "rgba(255,255,255,0.9)",
  },
  mutedText: {
    color: "rgba(255,255,255,0.75)",
  },

  // Buttons (reusable)
  buttonRed: {
    backgroundColor: THEME.red,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});

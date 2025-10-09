import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export const globalStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  
  // Textos
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  textSecondary: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  
  // Botones
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonAccent: {
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: COLORS.card,
    color: COLORS.text,
  },
  
  // cards
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardGold: {
    borderLeftColor: COLORS.secondary,
  },
  cardAccent: {
    borderLeftColor: COLORS.accent,
  },
  
  //  items de productos
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  // Badges de stock
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  stockLow: {
    backgroundColor: COLORS.danger,
  },
  stockMedium: {
    backgroundColor: COLORS.warning,
  },
  stockHigh: {
    backgroundColor: COLORS.success,
  },
  stockText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  
  // Header
  header: {
    backgroundColor: COLORS.primary,
  },
  
  // Scanner
  scannerContainer: {
    flex: 1,
    backgroundColor: COLORS.text,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  //LOGO
  logoContainer: {
    alignItems: 'center',
    margin:0,
    paddingBottom:0,
  },
  logo: {
    width: '50%',  
    height: 300, 
  }
});
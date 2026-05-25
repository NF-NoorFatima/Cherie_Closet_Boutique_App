import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ProductProvider } from './components/context/ProductContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebaseConsole"; // your firebase config
import { getDatabase, ref, set } from "firebase/database";
import { UserProvider, UserContext } from './components/context/UserContext'; 

// Shared Screens
import WelcomeScreen from './components/WelcomeScreen';
import Login from './screens/authencity/Login';
import Register from './screens/authencity/Register';
import RoleSelector from './screens/authencity/RoleSelector';

// Customer Screens
import Products from './screens/customers/Products';
import FormalWear from './screens/customers/FormalWear';
import CasualWear from './screens/customers/CasualWear';
import Signature from './screens/customers/Signature';
import Saree from './screens/customers/Saree';
import PlaceOrder from './screens/customers/PlaceOrder';
import ProductDetails from './screens/customers/ProductDetails';
import Cart from './screens/customers/Cart';
import WishList from './screens/customers/WishList';
import Orders from './screens/customers/Orders';
import ContactUs from './screens/customers/ContactUs';
import AccountScreen from './screens/customers/Account';
import EditAccount from './screens/customers/EditAccount';
import Wedding from './screens/customers/Wedding';
import Cord from './screens/customers/Cord';
import Review from './screens/customers/Review';

// Admin Screens
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import AddEditProductScreen from './screens/admin/AddEditProductScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import OrderDetailsScreen from './screens/admin/OrderDetailsScreen';
import SalesInsightsScreen from './screens/admin/SalesInsightsScreen';
import StockManagementScreen from './screens/admin/StockManagementScreen';
import DeleteProductScreen from './screens/admin/DeleteProductScreen';
import TrashScreen from './screens/admin/TrashScreen';
import SettingsScreen from './screens/admin/SettingsScreen';
import NotificationsScreen from './screens/admin/NotificationsScreen';
import Welcome from './screens/admin/WelcomeScreen';
import AdminRegister from './screens/authencity/AdminRegister';
import AdminLoginScreen from './screens/authencity/AdminLoginScreen';

const auth = getAuth(app);
const db = getDatabase(app);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const DrawerNavigation = () => (
  <Drawer.Navigator
    backBehavior="history"
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#FAF7F2' },
      headerTintColor: '#2C2C2C',
      headerTitleStyle: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 18 },
      drawerStyle: { backgroundColor: '#FFFFFF', width: 260 },
      drawerActiveBackgroundColor: '#F4F7F5',
      drawerActiveTintColor: '#7C9A8A',
      drawerInactiveTintColor: '#9E8E85',
      drawerLabelStyle: { fontSize: 16, marginLeft: -5, fontFamily: 'System' },
      drawerItemStyle: { marginVertical: 4, borderRadius: 12 }
    }}
  >
    <Drawer.Screen name="Categories" component={Products} options={{
      drawerIcon: ({ color }) => <Icon name="view-dashboard" size={22} color={color} />,
      title: 'All Collections'
    }} />
    <Drawer.Screen name="FormalWear" component={FormalWear} options={{
      drawerIcon: ({ color }) => <Icon name="briefcase-outline" size={22} color={color} />,
      title: 'Formal Wear'
    }} />
    <Drawer.Screen name="CasualWear" component={CasualWear} options={{
      drawerIcon: ({ color }) => <Icon name="shirt-outline" size={22} color={color} />,
      title: 'Casual Wear'
    }} /> 
    <Drawer.Screen name="Signature" component={Signature} options={{
      drawerIcon: ({ color }) => <Icon name="star-outline" size={22} color={color} />,
      title: 'Signature'
    }} />
    <Drawer.Screen name="Saree" component={Saree} options={{
      drawerIcon: ({ color }) => <Icon name="flower-outline" size={22} color={color} />,
      title: 'Saree'
    }} />
    <Drawer.Screen name="Cord" component={Cord} options={{
      drawerIcon: ({ color }) => <Icon name="grid-outline" size={22} color={color} />,
      title: 'Co-ord Sets'
    }} />
    <Drawer.Screen name="Wedding" component={Wedding} options={{
      drawerIcon: ({ color }) => <Icon name="rose-outline" size={22} color={color} />,
      title: 'Wedding Collection'
    }} />
  </Drawer.Navigator>
);

const TabNavigation = ({ route }) => {
  const { userId, email } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'WishList') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7C9A8A',
        tabBarInactiveTintColor: '#9E8E85',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderColor: '#E8E8E8',
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DrawerNavigation} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="WishList" component={WishList} />
      <Tab.Screen name="Account">
        {(props) => <AccountScreen {...props} userId={userId} email={email} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

function AdminDrawer({ route }) {
  const { userId, username, email } = route.params || {}; 
  return (
    <ProductProvider>
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#FAF7F2' },
          headerTintColor: '#2C2C2C',
          headerTitleStyle: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 18 },
          drawerStyle: { backgroundColor: '#FFFFFF', width: 260 },
          drawerActiveBackgroundColor: '#F4F7F5',
          drawerActiveTintColor: '#7C9A8A',
          drawerInactiveTintColor: '#9E8E85',
          drawerLabelStyle: { fontSize: 16, marginLeft: -5 },
          drawerItemStyle: { marginVertical: 4, borderRadius: 12 },
          drawerType: 'slide',
        }}
      >
        <Drawer.Screen name="Dashboard" component={AdminDashboardScreen} 
          initialParams={{ userId, username, email }}
          options={{
            drawerIcon: ({ color }) => <Icon name="view-dashboard" size={22} color={color} />,
          }} />
        <Drawer.Screen name="Products" component={ProductListScreen} options={{
          drawerIcon: ({ color }) => <Icon name="tshirt-crew" size={22} color={color} />,
        }} />
        <Drawer.Screen name="Edit Product" component={AddEditProductScreen} options={{
          drawerIcon: ({ color }) => <Icon name="plus-box" size={22} color={color} />,
        }} />
        <Drawer.Screen name="Orders" component={OrderListScreen} options={{
          drawerIcon: ({ color }) => <Icon name="shopping" size={22} color={color} />,
        }} />
        <Drawer.Screen name="Sales Insights" component={SalesInsightsScreen} options={{
          drawerIcon: ({ color }) => <Icon name="chart-bar" size={22} color={color} />,
        }} />
        <Drawer.Screen name="Stock Management" component={StockManagementScreen} options={{
          drawerIcon: ({ color }) => <Icon name="warehouse" size={22} color={color} />,
        }} />
        <Drawer.Screen name="Delete Product" component={DeleteProductScreen} options={{
          drawerIcon: ({ color, size }) => <Ionicons name="trash-bin" size={size} color={color} />,
        }} />
        <Drawer.Screen name="Trash" component={TrashScreen} options={{
          drawerIcon: ({ color, size }) => <Ionicons name="trash-outline" size={size} color={color} />,
        }} />
      </Drawer.Navigator>
    </ProductProvider>
  );
}

export default function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        set(ref(db, 'users/' + currentUser.uid), {
          email: currentUser.email,
          role: 'customer'
        }).then(() => {
          console.log("User saved successfully");
        }).catch((error) => {
          console.log("Error saving user:", error);
        });
      } else {
        console.log("No user is logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ProductProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider> 
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!role ? (
              <>
                <Stack.Screen name="RoleSelector">
                  {(props) => <RoleSelector {...props} setRole={setRole} />}
                </Stack.Screen>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              </>
            ) : role === 'customer' ? (
              <>
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <Stack.Screen name="HomeScreen" component={TabNavigation} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cart" component={Cart} />
                <Stack.Screen name="Casual" component={CasualWear} />
                <Stack.Screen name="Wedding" component={Wedding} />
                <Stack.Screen name="Formal" component={FormalWear} />
                <Stack.Screen name="Signature" component={Signature} />
                <Stack.Screen name="Saree" component={Saree} />
                <Stack.Screen name="Cord" component={Cord} />
                <Stack.Screen name="Products" component={Products} />
                <Stack.Screen name="ProductDetails" component={ProductDetails} />
                <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
                <Stack.Screen name="Orders" component={Orders} />
                <Stack.Screen name="ContactUs" component={ContactUs} />
                <Stack.Screen name="WishList" component={WishList} />
                <Stack.Screen name="AccountScreen" component={AccountScreen} />
                <Stack.Screen name="EditAccount" component={EditAccount} />
                <Stack.Screen name="Review" component={Review} />
              </>
            ) : (
              <>
                <Stack.Screen name="WelcomeScreen" component={Welcome} />
                <Stack.Screen name="AdminRegister" component={AdminRegister} />
                <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen} />
                <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
                <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="ProductList" component={ProductListScreen} />
                <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
                <Stack.Screen name="Trash" component={TrashScreen} />
                <Stack.Screen name="OrderListScreen" component={OrderListScreen} />
                <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
              </>
            )}
          </Stack.Navigator>
        </UserProvider> 
      </GestureHandlerRootView>
    </ProductProvider>
  );
}

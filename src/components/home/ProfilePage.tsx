import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { 
  User, 
  Edit3, 
  MapPin, 
  Mail, 
  Phone, 
  Save, 
  X, 
  Plus, 
  ShoppingBag, 
  Calendar, 
  Package,
  LogOut,
  LoaderCircle
} from "lucide-react";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "../../redux1/store";
import { 
  getProfile, 
  updateProfile, 
  logout, 
  Address 
} from "../../redux1/authSlice";
import { 
  fetchOrders, 
  fetchOrderStats, 
  cancelOrder} from "../../redux1/orderSlice";
import { Avatar } from "@mui/material";
import { HomePageNavBar } from './HomePageNavBar';
import { Footer } from './Footer';

interface EditableField {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phoneNumber: boolean;
  addresses: boolean;
}

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addresses: Address[];
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Redux selectors
  const user = useSelector((state: RootState) => state.auth.user);
  const profileLoading = useSelector((state: RootState) => state.auth.profileLoading);
  const orders = useSelector((state: RootState) => state.order.orders);
  const orderStats = useSelector((state: RootState) => state.order.stats);
  const ordersLoading = useSelector((state: RootState) => state.order.loading);
  const statsLoading = useSelector((state: RootState) => state.order.statsLoading);
  const cancelLoading = useSelector((state: RootState) => state.order.cancelLoading);

  // Local state
  const [editingFields, setEditingFields] = useState<EditableField>({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    addresses: false
  });
  
  const [formData, setFormData] = useState<UserForm>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    addresses: []
  });

  const [newAddress, setNewAddress] = useState<Address>({
    name: '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: '',
    isDefault: false
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        addresses: user.addresses || []
      });
    }
  }, [user]);

  // Fetch data on component mount
  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
    dispatch(fetchOrders({ page: 1, limit: 10 }));
    dispatch(fetchOrderStats());
  }, [dispatch, user]);

  // Handle field editing
  const toggleEdit = (field: keyof EditableField) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle form input changes
  const handleInputChange = (field: keyof UserForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle address changes
  const handleAddressChange = (index: number, field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => 
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  // Add new address
  const addAddress = () => {
    if (newAddress.name && newAddress.addressLine1 && newAddress.city) {
      setFormData(prev => ({
        ...prev,
        addresses: [...prev.addresses, newAddress]
      }));
      setNewAddress({
        name: '',
        addressLine1: '',
        city: '',
        state: '',
        pinCode: '',
        isDefault: false
      });
    } else {
      toast.error('Please fill required address fields');
    }
  };

  // Remove address
  const removeAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  // Save profile changes
const handleSave = async (field: keyof EditableField) => {
  try {
    const updateData: any = {};
    
    if (field === 'addresses') {
      // Check if there's a pending new address with required fields filled
      const hasPendingAddress = newAddress.name.trim() !== '' || 
                                newAddress.addressLine1.trim() !== '' || 
                                newAddress.city.trim() !== '';
      
      if (hasPendingAddress) {
        // Validate required fields
        if (!newAddress.name || !newAddress.addressLine1 || !newAddress.city) {
          toast.error('Please complete all required address fields (Name, Address Line, City) or clear them before saving');
          return;
        }
        
        // Add the pending address to formData before saving
        const updatedAddresses = [...formData.addresses, newAddress];
        updateData.addresses = updatedAddresses;
        
        // Clear the new address form after adding
        setNewAddress({
          name: '',
          addressLine1: '',
          city: '',
          state: '',
          pinCode: '',
          isDefault: false
        });
      } else {
        updateData.addresses = formData.addresses;
      }
    } else {
      updateData[field] = formData[field as keyof UserForm];
    }

    await dispatch(updateProfile(updateData)).unwrap();
    toast.success('Profile updated successfully');
    setEditingFields(prev => ({ ...prev, [field]: false }));
    
    // Update formData with the new addresses if we added a pending one
    if (field === 'addresses' && updateData.addresses) {
      setFormData(prev => ({
        ...prev,
        addresses: updateData.addresses
      }));
    }
  } catch (error) {
    toast.error('Failed to update profile');
    console.error('Update error:', error);
  }
};

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Cancel order
  const handleCancelOrder = async (orderId: string) => {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success('Order cancelled successfully');
      dispatch(fetchOrders({ page: 1, limit: 10 }));
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (!user && profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }
  
  // Add this function
  const handleContinueToCheckout = () => {
    if (formData.addresses.length === 0) {
      toast.error('Please add at least one address before proceeding to checkout');
      return;
    }
    navigate('/cart'); // Adjust the path as needed
  };

  return (
    <>
      <HomePageNavBar />
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header - Responsive */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar sx={{ width: { xs: 48, sm: 56, md: 64 }, height: { xs: 48, sm: 56, md: 64 } }} className="text-lg sm:text-xl md:text-2xl">
                  {user.firstName.charAt(0)}
                </Avatar>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 break-all">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto text-sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Tabs - Mobile Friendly */}
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto">
            <Button
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              onClick={() => setActiveTab('profile')}
              className="flex-shrink-0 text-sm sm:text-base"
            >
              <User className="w-4 h-4 mr-1 sm:mr-2" />
              Profile
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('orders')}
              className="flex-shrink-0 text-sm sm:text-base"
            >
              <ShoppingBag className="w-4 h-4 mr-1 sm:mr-2" />
              Orders
            </Button>
          </div>

          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      {editingFields.firstName ? (
                        <>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="flex-1 text-sm sm:text-base"
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              onClick={() => handleSave('firstName')}
                              disabled={profileLoading}
                              className="flex-1 sm:flex-none"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEdit('firstName')}
                              className="flex-1 sm:flex-none"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 py-2 text-sm sm:text-base">{user.firstName}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleEdit('firstName')}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      {editingFields.lastName ? (
                        <>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="flex-1 text-sm sm:text-base"
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              onClick={() => handleSave('lastName')}
                              disabled={profileLoading}
                              className="flex-1 sm:flex-none"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEdit('lastName')}
                              className="flex-1 sm:flex-none"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 py-2 text-sm sm:text-base">{user.lastName}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleEdit('lastName')}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      {editingFields.email ? (
                        <>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1 text-sm sm:text-base"
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              onClick={() => handleSave('email')}
                              disabled={profileLoading}
                              className="flex-1 sm:flex-none"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEdit('email')}
                              className="flex-1 sm:flex-none"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 py-2 flex items-center text-sm sm:text-base break-all">
                            <Mail className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                            {user.email}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleEdit('email')}
                            className="flex-shrink-0"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      {editingFields.phoneNumber ? (
                        <>
                          <Input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="flex-1 text-sm sm:text-base"
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              onClick={() => handleSave('phoneNumber')}
                              disabled={profileLoading}
                              className="flex-1 sm:flex-none"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEdit('phoneNumber')}
                              className="flex-1 sm:flex-none"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 py-2 flex items-center text-sm sm:text-base">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            {user.phoneNumber}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleEdit('phoneNumber')}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="flex items-center text-lg sm:text-xl">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Addresses
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleEdit('addresses')}
                      className="self-start sm:self-auto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingFields.addresses ? (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Existing Addresses */}
                      {formData.addresses.map((address, index) => (
                        <div key={index} className="p-3 sm:p-4 border rounded-lg space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <Input
                                value={address.name}
                                onChange={(e) => handleAddressChange(index, 'name', e.target.value)}
                                placeholder="Address name"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Pin Code</label>
                              <Input
                                value={address.pinCode}
                                onChange={(e) => handleAddressChange(index, 'pinCode', e.target.value)}
                                placeholder="Pin code"
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Address Line</label>
                            <Textarea
                              value={address.addressLine1}
                              onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                              placeholder="Complete address"
                              rows={2}
                              className="text-sm resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">City</label>
                              <Input
                                value={address.city}
                                onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                                placeholder="City"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">State</label>
                              <Input
                                value={address.state}
                                onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                                placeholder="State"
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={address.isDefault}
                                onChange={(e) => handleAddressChange(index, 'isDefault', e.target.checked)}
                                className="mr-2"
                              />
                              Default Address
                            </label>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeAddress(index)}
                              className="w-full sm:w-auto"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Add New Address */}
                      <div className="p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-3">
                        <h4 className="font-medium text-sm sm:text-base">Add New Address</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            value={newAddress.name}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Address name"
                            className="text-sm"
                          />
                          <Input
                            value={newAddress.pinCode}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, pinCode: e.target.value }))}
                            placeholder="Pin code"
                            className="text-sm"
                          />
                        </div>
                        <Textarea
                          value={newAddress.addressLine1}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                          placeholder="Complete address"
                          rows={2}
                          className="text-sm resize-none"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            value={newAddress.city}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="City"
                            className="text-sm"
                          />
                          <Input
                            value={newAddress.state}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="State"
                            className="text-sm"
                          />
                        </div>
                        {/*<Button onClick={addAddress} className="w-full text-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Address
                        </Button>*/}
                      </div>

                      {/* Save/Cancel buttons */}
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => toggleEdit('addresses')}
                          className="order-2 sm:order-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSave('addresses')}
                          disabled={profileLoading}
                          className="order-1 sm:order-2"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Addresses
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {user.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((address, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                              <span className="font-medium text-sm sm:text-base">{address.name}</span>
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              {address.addressLine1}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {address.city}, {address.state} - {address.pinCode}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4 text-sm">
                          No addresses added yet
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
                <div className="p-4 pt-0">
                  <Button 
                    onClick={handleContinueToCheckout} 
                    className="w-full sm:w-fit text-sm"
                    disabled={formData.addresses.length === 0}
                  >
                    Continue to Checkout
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Order Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center">
                      <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {statsLoading ? (
                            <LoaderCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                          ) : (
                            orderStats.reduce((acc, stat) => acc + stat.count, 0)
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center">
                      <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Recent Orders</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {ordersLoading ? (
                            <LoaderCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                          ) : (
                            orders.length
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders List */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <LoaderCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">Order #{order.orderNumber}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                              <p className="font-semibold text-sm sm:text-base">{formatCurrency(order.total)}</p>
                              <Badge
                                variant={order.status === 'delivered' ? 'default' :
                                  order.status === 'cancelled' ? 'destructive' :
                                    order.status === 'pending' ? 'secondary' :
                                      'outline'}
                                className="text-xs mt-1"
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 text-xs sm:text-sm">
                            <div>
                              <p className="text-gray-600">Items: {order.itemCount}</p>
                              <p className="text-gray-600">Payment: {order.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span>Payment Status:</span>
                                <Badge variant="outline" className="text-xs w-fit">
                                  {order.paymentStatus}
                                </Badge>
                              </p>
                              {order.trackingNumber && (
                                <p className="text-gray-600">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item._id} className="flex items-center justify-between text-xs sm:text-sm gap-3">
                                <div className="flex items-center flex-1 min-w-0">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mr-2 sm:mr-3 flex-shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium truncate">{item.productName}</p>
                                    <p className="text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-medium flex-shrink-0">{formatCurrency(item.itemTotal)}</p>
                              </div>
                            ))}
                          </div>

                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <div className="mt-3 sm:mt-4 flex justify-end">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={cancelLoading}
                                className="w-full sm:w-auto text-xs sm:text-sm"
                              >
                                {cancelLoading ? (
                                  <LoaderCircle className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                                ) : (
                                  <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                )}
                                Cancel Order
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">No orders found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
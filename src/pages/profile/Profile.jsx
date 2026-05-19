import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore.js";
import { updateProfileApi, changePasswordApi } from "../../api/auth.api.js";

function Profile() {
  const user = useAuthStore(function (s) { return s.user; });
  const [profile, setProfile] = useState({ name: user?.name || "", phone: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  async function saveProfile(e) {
    e.preventDefault();
    try {
      const res = await updateProfileApi(profile);
      useAuthStore.getState().setAuth({ user: { ...user, ...res.data.data }, accessToken: useAuthStore.getState().accessToken });
      toast.success("Profile updated");
    } catch { toast.error("Update failed"); }
  }

  async function savePassword(e) {
    e.preventDefault();
    try {
      await changePasswordApi(passwords);
      toast.success("Password changed");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch { toast.error("Password change failed"); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={saveProfile} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 space-y-3">
        <h2 className="font-semibold">Profile</h2>
        <input value={profile.name} onChange={function (e) { setProfile({ ...profile, name: e.target.value }); }} className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
        <input value={profile.phone} onChange={function (e) { setProfile({ ...profile, phone: e.target.value }); }} placeholder="Phone" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-white">Save Profile</button>
      </form>
      <form onSubmit={savePassword} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 space-y-3">
        <h2 className="font-semibold">Change Password</h2>
        <input type="password" value={passwords.currentPassword} onChange={function (e) { setPasswords({ ...passwords, currentPassword: e.target.value }); }} placeholder="Current password" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
        <input type="password" value={passwords.newPassword} onChange={function (e) { setPasswords({ ...passwords, newPassword: e.target.value }); }} placeholder="New password" className="w-full rounded-xl border px-4 py-2 dark:bg-slate-800" />
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-white">Change Password</button>
      </form>
    </div>
  );
}
export default Profile;

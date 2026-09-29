import {
    Facebook, Github, Globe, Instagram, Link, Linkedin,
    Mail, MapPin, Phone, Twitter, Youtube,
} from "lucide-react";

const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    twitter: Twitter,
    x: Twitter,
    youtube: Youtube,
    facebook: Facebook,
};

const contactIcons = {
    mail: Mail,
    email: Mail,
    phone: Phone,
    location: MapPin,
    website: Globe,
};

// Unknown names fall back to a generic icon, so new entries in data.js never break the page
export const getSocialIcon = (name = "") => socialIcons[name.toLowerCase()] ?? Globe;

export const getContactIcon = (label = "") => contactIcons[label.toLowerCase()] ?? Link;

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Shield, Clock, Star, Play, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { getParallaxMedia, Media } from '../services/mediaService';
import DecryptedText from './DecryptedText';

gsap.registerPlugin(ScrollTrigger);

export const AnimatedImageHero = () => {
  const [parallaxMedia, setParallaxMedia] = useState<Media[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const parallax = await getParallaxMedia();
        if (parallax.length > 0) setParallaxMedia(parallax);
      } catch (error) {
        console.log('Using fallback media');
      }
    };
    fetchMedia();
  }, []);

  // Three.js particle background
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Arra
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, ContactShadows, Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// 资源前缀：本地是 /，GitHub Pages 是 /22x-
const ASSET_BASE = import.meta.env.BASE_URL;

function Box({ position, size, color, material = {}, onClick, castShadow = true, receiveShadow = true, rotation }) {
  return (
    <mesh position={position} scale={size} rotation={rotation} castShadow={castShadow} receiveShadow={receiveShadow} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={material.roughness ?? 0.78} metalness={material.metalness ?? 0.05} {...material} />
    </mesh>
  );
}

function Cylinder({ position, radiusTop, radiusBottom, height, color, onClick, radialSegments = 32 }) {
  return (
    <mesh position={position} castShadow receiveShadow onClick={onClick}>
      <cylinderGeometry args={[radiusTop, radiusBottom, height, radialSegments]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

function Room({ onComputer, onHeadphones, onGift, giftOpen }) {
  const wood = '#243040';      // 冷调深灰蓝木
  const darkWood = '#171d27';  // 更深的石墨黑蓝
  // 检测电脑屏幕素材：支持视频、图片，都没有就显示 fallback
  const [screenType, setScreenType] = useState('none'); // 'video' | 'image' | 'none'

  useEffect(() => {
    // 优先检测视频，存在就用视频
    const videoProbe = document.createElement('video');
    videoProbe.preload = 'metadata';
    videoProbe.src = `${ASSET_BASE}laptop-screen.mp4`;
    videoProbe.onloadedmetadata = () => {
      videoProbe.pause();
      videoProbe.remove();
      setScreenType('video');
    };
    videoProbe.onerror = () => {
      videoProbe.remove();
      // 视频没有，再试试图片
      const imgProbe = new Image();
      imgProbe.onload = () => setScreenType('image');
      imgProbe.onerror = () => setScreenType('none');
      imgProbe.src = `${ASSET_BASE}laptop-screen.png`;
    };
    // 5s 超时兜底
    const timer = setTimeout(() => setScreenType(s => s === 'none' ? 'none' : s), 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <group>
      {/* 电竞少年风：石墨黑蓝 + 冷调木纹 + 冰蓝霓虹 */}
      <Box position={[0, -0.13, 0]} size={[10, 0.25, 10]} color="#1a2029" material={{ roughness: 0.9 }} />
      {/* 深色木纹缝隙 */}
      {Array.from({ length: 12 }, (_, i) => <Box key={i} position={[-4.5 + i * 0.82, 0.005, 0]} size={[0.018, 0.012, 9.8]} color="#2b3543" castShadow={false} />)}
      <Box position={[0, 2.5, -5]} size={[10, 5, 0.2]} color="#1b2430" material={{ roughness: 0.95 }} />
      <Box position={[-5, 2.5, 0]} size={[0.2, 5, 10]} color="#161d26" material={{ roughness: 0.95 }} />
      <Box position={[5, 2.5, 0]} size={[0.2, 5, 10]} color="#121821" material={{ roughness: 0.95 }} />
      <Box position={[0, 5, 0]} size={[10, 0.18, 10]} color="#0a0e15" />
      {/* 深色踢脚线 */}
      <Box position={[0, 0.15, -4.88]} size={[10, 0.15, 0.08]} color="#243040" />
      <Box position={[-4.88, 0.15, 0]} size={[0.08, 0.15, 10]} color="#243040" />
      {/* 电竞海报：LEVEL UP + 冰蓝霓虹边框 */}
      <Box position={[-2.8, 3.05, -4.87]} size={[1.35, 1.65, 0.06]} color="#161d26" />
      <Box position={[-2.8, 3.05, -4.82]} size={[1.23, 1.53, 0.025]} color="#08121c" material={{ emissive: '#00c8ff', emissiveIntensity: 0.45, roughness: 0.8 }} />
      <Text position={[-2.8, 3.2, -4.79]} fontSize={0.16} color="#d6f4ff" anchorX="center" anchorY="middle" textAlign="center" outlineWidth={0.008} outlineColor="#00c8ff">
        LEVEL UP
      </Text>
      <Text position={[-2.8, 2.85, -4.79]} fontSize={0.1} color="#7fd8ff" anchorX="center" anchorY="middle" textAlign="center">
        happy birthday ✦
      </Text>
      {/* 小装饰画：奖杯星星 */}
      <Box position={[0.3, 3.0, -4.87]} size={[0.85, 1.0, 0.06]} color="#161d26" />
      <Box position={[0.3, 3.0, -4.82]} size={[0.73, 0.88, 0.025]} color="#0a1420" material={{ emissive: '#3a7aff', emissiveIntensity: 0.4, roughness: 0.8 }} />
      <Text position={[0.3, 3.15, -4.79]} fontSize={0.22} color="#cfe4ff" anchorX="center" anchorY="middle" textAlign="center">
        ★
      </Text>
      <Text position={[0.3, 2.85, -4.79]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" textAlign="center">
        ☾
      </Text>
      {/* 冰蓝窗户：窗外城市夜色 */}
      <Box position={[3.15, 2.85, -4.86]} size={[2.3, 2.15, 0.07]} color="#161d26" />
      <Box position={[3.15, 2.85, -4.8]} size={[2.08, 1.93, 0.035]} color="#0a2a4a" material={{ emissive: '#1060a0', emissiveIntensity: 1.1, roughness: 0.25 }} />
      <Box position={[3.15, 2.85, -4.76]} size={[0.055, 2, 0.05]} color="#243040" />
      <Box position={[3.15, 2.85, -4.75]} size={[2.15, 0.055, 0.05]} color="#243040" />
      {/* 窗外霓虹光晕（从窗户溢出到房间） */}
      <pointLight position={[3.15, 2.85, -4.2]} color="#3a90ff" intensity={3.2} distance={5} decay={1.5} />
      {/* 窗户霓虹小灯点 */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`win-star-${i}`} position={[2.3 + i * 0.45, 2.0 + (i % 2) * 0.6, -4.78]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#80a0ff" emissiveIntensity={1.5} />
        </mesh>
      ))}
      {/* desk */}
      <Box position={[-1.7, 1.25, -3.45]} size={[3.2, 0.14, 1.25]} color={wood} />
      {[-3.05, -0.35].map(x => [-3.88, -3.02].map(z => <Box key={`${x}-${z}`} position={[x, 0.61, z]} size={[0.12, 1.22, 0.12]} color={darkWood} />))}
      <Box position={[-1.7, 0.54, -3.45]} size={[2.8, 0.12, 0.9]} color={darkWood} />
      {/* laptop and glowing display - 银色金属机身 + 暗蓝屏幕 */}
      <group position={[-1.65, 1.34, -3.38]} onClick={onComputer}>
        <Box position={[0, 0.12, 0.02]} size={[1.25, 0.055, 0.78]} color="#556a80" material={{ metalness: 0.75, roughness: 0.3 }} />
        <Box position={[0, 0.48, -0.31]} size={[1.2, 0.68, 0.055]} color="#0d1020" material={{ metalness: 0.25, roughness: 0.2, emissive: '#0a3a6a', emissiveIntensity: 0.25 }} />
        {/* 封面：transform 模式精确对齐屏幕 3D 矩形，永不穿模也不飘动 */}
        {/* 屏幕 Box: pos[0,0.48,-0.31] size[1.2, 0.68, 0.055]，前表面中心 z=-0.2825 */}
        {/* 340×192 CSS × distanceFactor(≈0.00353) = 1.2×0.68 世界单位 */}
        <Html
          position={[0, 0.48, -0.2825]}
          rotation={[0, 0, 0]}
          transform
          distanceFactor={0.00353}
          occlude
          style={{ pointerEvents: 'none', width: '340px', height: '192px' }}
        >
          <div className="laptop-screen laptop-desktop">
            {/* 桌面壁纸背景 */}
            <div className="desk-wallpaper" />
            {/* 左上角图标 */}
            <div className="desk-icons">
              <div className="desk-icon"><span>🎂</span><em>Cake</em></div>
              <div className="desk-icon"><span>🎁</span><em>Gift</em></div>
              <div className="desk-icon"><span>🎵</span><em>Music</em></div>
              <div className="desk-icon"><span>💌</span><em>Message</em></div>
              <div className="desk-icon"><span>✨</span><em>Wish</em></div>
            </div>
            {/* 右下角时间/问候 */}
            <div className="desk-widget">
              <div className="desk-time">12:00</div>
              <div className="desk-greet">Happy Birthday!</div>
            </div>
            {/* 底部任务栏 */}
            <div className="desk-taskbar">
              <div className="tb-start">🎮</div>
              <div className="tb-dots">
                <span className="active">▶</span>
                <span>🎵</span>
                <span>📁</span>
              </div>
              <div className="tb-right">🔊 📶 🔋</div>
            </div>
          </div>
        </Html>
      </group>


      {/* headphones on desk */}
      <group position={[-0.4, 1.44, -3.32]} onClick={onHeadphones}>
        {/* 头梁：half-torus 默认就在 XY 平面，弧线朝上 = 倒 U 形，开口朝下 */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <torusGeometry args={[0.21, 0.035, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#20232a" roughness={0.65} />
        </mesh>

        {/* 左侧连接杆（连接头梁末端与耳罩顶部） */}
        <mesh position={[-0.21, 0.06, 0]} castShadow>
          <boxGeometry args={[0.04, 0.10, 0.06]} />
          <meshStandardMaterial color="#292c32" roughness={0.6} />
        </mesh>

        {/* 右侧连接杆 */}
        <mesh position={[0.21, 0.06, 0]} castShadow>
          <boxGeometry args={[0.04, 0.10, 0.06]} />
          <meshStandardMaterial color="#292c32" roughness={0.6} />
        </mesh>

        {/* 左耳罩：cylinder 默认轴是 Y，绕 Z 转 90° 让轴沿 X 朝内 */}
        <group position={[-0.21, 0.025, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.095, 0.095, 0.13, 32]} />
            <meshStandardMaterial color="#20232a" roughness={0.8} />
          </mesh>
          {/* 耳垫圆环（inner） */}
          <mesh position={[0.066, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.072, 0.072, 0.02, 32]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.9} />
          </mesh>
          {/* 外圈装饰环 */}
          <mesh position={[0.066, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.095, 0.006, 8, 32]} />
            <meshStandardMaterial color="#353942" metalness={0.25} roughness={0.5} />
          </mesh>
        </group>

        {/* 右耳罩 */}
        <group position={[0.21, 0.025, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.095, 0.095, 0.13, 32]} />
            <meshStandardMaterial color="#20232a" roughness={0.8} />
          </mesh>
          {/* 耳垫圆环 */}
          <mesh position={[-0.066, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.072, 0.072, 0.02, 32]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.9} />
          </mesh>
          {/* 外圈装饰环 */}
          <mesh position={[-0.066, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.095, 0.006, 8, 32]} />
            <meshStandardMaterial color="#353942" metalness={0.25} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* desk lamp - 现代圆顶弧形台灯（暖黄，更亮） */}
      <group position={[-2.9, 1.32, -3.35]}>
        {/* 底座圆盘 */}
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.23, 0.06, 40]} />
          <meshStandardMaterial color="#22222f" metalness={0.65} roughness={0.35} />
        </mesh>
        {/* 底座发光细环 */}
        <mesh position={[0, 0.062, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.185, 0.008, 8, 40]} />
          <meshStandardMaterial color="#ffc070" emissive="#ffc070" emissiveIntensity={1.3} />
        </mesh>
        {/* 竖直灯杆 */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.032, 0.52, 24]} />
          <meshStandardMaterial color="#2c2c3c" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* 水平支臂（伸向笔记本方向） */}
        <mesh position={[0.15, 0.58, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.3, 20]} />
          <meshStandardMaterial color="#2c2c3c" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* 圆顶灯罩（开口朝下） */}
        <mesh position={[0.3, 0.62, 0]} castShadow>
          <sphereGeometry args={[0.23, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4a4060" metalness={0.4} roughness={0.32} emissive="#ffb060" emissiveIntensity={0.45} side={THREE.DoubleSide} />
        </mesh>
        {/* 灯罩内发光面（朝下） */}
        <mesh position={[0.3, 0.612, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.215, 32]} />
          <meshStandardMaterial color="#fff0d0" emissive="#ffe0b0" emissiveIntensity={3.2} side={THREE.DoubleSide} />
        </mesh>
        {/* 灯罩下光晕（半透明发光球） */}
        <mesh position={[0.3, 0.56, 0]}>
          <sphereGeometry args={[0.19, 20, 14]} />
          <meshBasicMaterial color="#ffdca8" transparent opacity={0.28} />
        </mesh>
      </group>
      {/* 主光源（灯罩下方，明显更亮） */}
      <pointLight position={[-2.6, 1.92, -3.35]} color="#ffd8a0" intensity={18} distance={9} decay={1.1} />
      {/* 柔光补光，照亮桌面与笔记本周围 */}
      <pointLight position={[-2.6, 1.6, -3.0]} color="#ffc888" intensity={7} distance={6} decay={1.2} />
      {/* bed on right - 石墨黑 + 藏青被子 + 银灰枕头 */}
      <Box position={[2.75, 0.42, -1.35]} size={[2.55, 0.48, 3.25]} color="#171d27" />
      <Box position={[2.75, 0.72, -1.35]} size={[2.48, 0.22, 3.12]} color="#2a3340" />
      {/* 藏青被子 */}
      <Box position={[2.75, 0.86, -0.65]} size={[2.36, 0.18, 1.55]} color="#1f3350" />
      {/* 床头两个深灰枕头 */}
      <Box position={[2.13, 0.94, -2.48]} size={[0.88, 0.24, 0.58]} color="#252d38" />
      <Box position={[3.35, 0.94, -2.48]} size={[0.88, 0.24, 0.58]} color="#252d38" />
      {/* 银灰床头靠枕 */}
      <Box position={[2.75, 1.02, -2.48]} size={[1.3, 0.28, 0.4]} color="#7a8798" />
      {/* 床头板 */}
      <Box position={[2.75, 1.02, -2.92]} size={[2.6, 1.05, 0.16]} color="#171d27" />
      {/* 床头板顶霓虹条（冰蓝） */}
      <Box position={[2.75, 1.56, -2.92]} size={[2.75, 0.14, 0.22]} color="#243040" />
      <mesh position={[2.75, 1.56, -2.82]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[2.6, 0.08, 0.04]} />
        <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[2.75, 1.7, -2.8]} color="#3a9cff" intensity={3.0} distance={4} decay={1.5} />
      {/* bedside table and lamp - 黑色金属 + 暖黄 */}
      <Box position={[4.18, 0.55, -2.75]} size={[0.72, 0.95, 0.72]} color={wood} />
      <Cylinder position={[4.18, 1.14, -2.75]} radiusTop={0.15} radiusBottom={0.2} height={0.06} color="#171d27" />
      <mesh position={[4.18, 1.34, -2.75]} castShadow>
        <coneGeometry args={[0.22, 0.28, 24]} />
        <meshStandardMaterial color="#2a3444" emissive="#ff8040" emissiveIntensity={0.55} />
      </mesh>
      <pointLight position={[4.18, 1.4, -2.75]} color="#ffb070" intensity={5.5} distance={6} decay={1} />
      {/* cake on small stool - 深色金属托盘 */}
      <Cylinder position={[1.02, 0.48, 0.25]} radiusTop={0.44} radiusBottom={0.48} height={0.12} color="#171d27" />
      <Cylinder position={[1.02, 0.23, 0.25]} radiusTop={0.055} radiusBottom={0.075} height={0.42} color="#0d1219" />
      <Cylinder position={[1.02, 0.06, 0.25]} radiusTop={0.38} radiusBottom={0.42} height={0.08} color="#171d27" />
      {/* 蛋糕主体 */}
      <CakeBase position={[1.02, 0.62, 0.25]} />
      {/* 蜡烛火焰 */}
      <AnimatedFlame position={[1.02 + -0.18, 0.88, 0.25]} />
      <AnimatedFlame position={[1.02 + 0, 0.88, 0.25]} />
      <AnimatedFlame position={[1.02 + 0.18, 0.88, 0.25]} />
      {/* 蛋糕 + 礼物盒区域聚光（暖黄，从上往下照） */}
      <pointLight position={[0.5, 3.2, 0.2]} color="#ffd79a" intensity={5.0} distance={8} decay={1.2} />
      {/* gift box - 电竞风：石墨黑盒 + 冰蓝发光丝带 */}
      <group position={[0.05, 0.34, -0.15]} onClick={onGift}>
        <Box position={[0, 0, 0]} size={[0.72, 0.62, 0.72]} color="#171d27" />
        {!giftOpen && <>
          <Box position={[0, 0.33, 0]} size={[0.78, 0.1, 0.78]} color="#243040" />
          <Box position={[0, 0.34, 0]} size={[0.11, 0.12, 0.8]} color="#00c8ff" />
          <Box position={[0, 0.34, 0]} size={[0.8, 0.12, 0.11]} color="#00c8ff" />
          {/* 冰蓝发光丝带 */}
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[0.115, 0.125, 0.81]} />
            <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={0.7} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[0.81, 0.125, 0.115]} />
            <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={0.7} />
          </mesh>
          {/* 冰蓝蝴蝶结 */}
          <mesh position={[-0.09, 0.47, 0]} rotation={[0, 0, -0.2]}>
            <torusGeometry args={[0.12, 0.035, 10, 24]} />
            <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={0.9} metalness={0.2} roughness={0.4} />
          </mesh>
          <mesh position={[0.09, 0.47, 0]} rotation={[0, 0, 0.2]}>
            <torusGeometry args={[0.12, 0.035, 10, 24]} />
            <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={0.9} metalness={0.2} roughness={0.4} />
          </mesh>
        </>}
      </group>
      {/* 深色圆形地毯 + 冰蓝边 */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#202835" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.05, 3.25, 64]} />
        <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={0.8} roughness={0.3} />
      </mesh>
      {/* 窗边：霓虹三角柱装饰（冰蓝） */}
      <mesh position={[4.4, 0.4, -2.0]} castShadow rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.8, 3]} />
        <meshStandardMaterial color="#0a1420" emissive="#3a7aff" emissiveIntensity={0.6} roughness={0.5} />
      </mesh>
      {/* 篮球 */}
      <mesh position={[4.32, 0.26, -0.55]} castShadow>
        <sphereGeometry args={[0.26, 28, 20]} />
        <meshStandardMaterial color="#e86a24" roughness={0.75} metalness={0.05} />
      </mesh>
      <mesh position={[4.32, 0.26, -0.55]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.26, 0.008, 6, 32]} />
        <meshStandardMaterial color="#1a1210" roughness={0.8} />
      </mesh>
      <mesh position={[4.32, 0.26, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.008, 6, 32]} />
        <meshStandardMaterial color="#1a1210" roughness={0.8} />
      </mesh>
      {/* 靠墙的滑板 */}
      <group position={[4.72, 0.6, -3.55]} rotation={[0, 0, -0.22]}>
        <Box position={[0, 0, 0]} size={[0.06, 1.1, 0.26]} color="#2a3444" material={{ roughness: 0.6 }} />
        {/* 板面贴纸条 */}
        <Box position={[0.032, 0.05, 0]} size={[0.006, 0.72, 0.14]} color="#00c8ff" material={{ emissive: '#00c8ff', emissiveIntensity: 0.5, roughness: 0.5 }} />
        {/* 四个轮子 */}
        {[[-0.42, 0.1], [-0.42, -0.1], [0.42, 0.1], [0.42, -0.1]].map(([y, z], i) => (
          <mesh key={`wheel-${i}`} position={[0.06, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 14]} />
            <meshStandardMaterial color="#12161c" roughness={0.85} />
          </mesh>
        ))}
      </group>
      {/* 桌面上的小摆件：游戏机手柄 */}
      <group position={[-0.2, 1.49, -3.8]} rotation={[0.2, 0.4, 0.1]}>
        <Box position={[0, 0, 0]} size={[0.28, 0.04, 0.14]} color="#243040" />
        <Box position={[-0.11, 0.025, 0]} size={[0.07, 0.03, 0.07]} color="#2a3444" />
        <Box position={[0.11, 0.025, 0]} size={[0.07, 0.03, 0.07]} color="#2a3444" />
        <mesh position={[0, 0.028, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={1.5} />
        </mesh>
      </group>
      {/* 墙上霓虹挂灯：彩虹条 + 星星 */}
      {Array.from({ length: 7 }, (_, i) => {
        const colors = ['#00c8ff', '#ffd060', '#60ff90', '#3a7aff', '#a060ff', '#ff7a30', '#ffb060'];
        return (
          <mesh key={`neon-${i}`} position={[-2.5 + i * 0.85, 4.4, -4.82]}>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={1.2} />
          </mesh>
        );
      })}
      {/* 霓虹星星点缀 */}
      <mesh position={[1.5, 4.5, -4.8]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#80a0ff" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[-4.0, 4.3, -4.8]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#4aa8ff" emissiveIntensity={1.8} />
      </mesh>
      {/* 天花板吸顶灯 - 黑色金属 + 暖黄中心 */}
      <Cylinder position={[0, 4.88, -1.8]} radiusTop={0.28} radiusBottom={0.28} height={0.05} color="#171d27" />
      <mesh position={[0, 4.75, -1.8]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.45, 0.4, 24]} />
        <meshStandardMaterial color="#243040" emissive="#ffc070" emissiveIntensity={0.65} roughness={0.5} />
      </mesh>
      <pointLight position={[0, 4.6, -1.8]} color="#ffc070" intensity={4.8} distance={10} decay={1.5} />
      {/* 电脑桌上小装饰：霓虹小方块 */}
      <mesh position={[-3.2, 1.39, -3.15]} rotation={[0.1, 0.2, 0.05]}>
        <boxGeometry args={[0.14, 0.03, 0.12]} />
        <meshStandardMaterial color="#171d27" emissive="#60d0ff" emissiveIntensity={0.5} />
      </mesh>
      {/* ContactShadows - 深夜模式 */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={9} blur={3} far={5} color="#000000" />
    </group>
  );
}

function FirstPersonMovement({ locked, mobileInput }) {
  const { camera } = useThree();
  const keys = useRef({});
  const touchMove = useRef({ fwd: 0, right: 0 }); // 移动端虚拟摇杆输入 -1..1
  const touchLook = useRef({ yaw: 0, pitch: 0 }); // 移动端拖拽看视角 -delta 累积

  useEffect(() => {
    const down = e => { keys.current[e.code] = true; };
    const up = e => { keys.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // 手机端：监听虚拟摇杆的按键事件（由 MobileJoystick 组件触发）
  useEffect(() => {
    if (!mobileInput) return;
    const onTouchMove = (e) => { touchMove.current = e.detail; };  // { fwd, right }
    const onTouchLook = (e) => { touchLook.current = e.detail; };  // { yaw, pitch }
    window.addEventListener('touch-move', onTouchMove);
    window.addEventListener('touch-look', onTouchLook);
    return () => {
      window.removeEventListener('touch-move', onTouchMove);
      window.removeEventListener('touch-look', onTouchLook);
    };
  }, [mobileInput]);

  useFrame((_, delta) => {
    if (!locked && !mobileInput) return;

    // === 视角旋转（手机拖拽环顾）===
    if (mobileInput) {
      const { yaw, pitch } = touchLook.current;
      if (yaw !== 0 || pitch !== 0) {
        // 绕 Y 轴转（yaw），绕 X 轴转（pitch）
        camera.rotation.order = 'YXZ';
        camera.rotation.y -= yaw;
        camera.rotation.x -= pitch;
        camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -Math.PI / 2.2, Math.PI / 2.2);
        touchLook.current = { yaw: 0, pitch: 0 };
      }
    }

    const speed = 2.8 * Math.min(delta, 0.05);
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize().negate();

    let fwdInput = 0, rightInput = 0;
    if (keys.current.KeyW || keys.current.ArrowUp) fwdInput += 1;
    if (keys.current.KeyS || keys.current.ArrowDown) fwdInput -= 1;
    if (keys.current.KeyA || keys.current.ArrowLeft) rightInput -= 1;
    if (keys.current.KeyD || keys.current.ArrowRight) rightInput += 1;
    if (mobileInput) {
      fwdInput += touchMove.current.fwd;
      rightInput += touchMove.current.right;
    }
    if (fwdInput !== 0) camera.position.addScaledVector(forward, speed * Math.max(-1, Math.min(1, fwdInput)));
    if (rightInput !== 0) camera.position.addScaledVector(right, speed * Math.max(-1, Math.min(1, rightInput)));

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -4.45, 4.45);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -4.45, 4.45);
    camera.position.y = 1.65;
  });
  return null;
}

// ====== 手机端虚拟摇杆 ======
function MobileJoystick() {
  const [fwd, setFwd] = useState(0);
  const [right, setRight] = useState(0);
  const [dragging, setDragging] = useState(false);
  const baseRef = useRef(null);
  const vecRef = useRef({ x: 0, y: 0 });

  const emit = (vx, vy) => {
    vecRef.current = { x: vx, y: vy };
    window.dispatchEvent(new CustomEvent('touch-move', { detail: { fwd: -vy, right: vx } }));
  };

  const handleStart = (e) => {
    e.preventDefault();
    setDragging(true);
    const t = e.touches ? e.touches[0] : e;
    const base = baseRef.current.getBoundingClientRect();
    const centerX = base.left + base.width / 2;
    const centerY = base.top + base.height / 2;
    const dx = t.clientX - centerX;
    const dy = t.clientY - centerY;
    const len = Math.min(50, Math.hypot(dx, dy));
    const ang = Math.atan2(dy, dx);
    const vx = (Math.cos(ang) * len) / 50;
    const vy = (Math.sin(ang) * len) / 50;
    setRight(vx); setFwd(vy);
    emit(vx, vy);
  };

  const handleMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const t = e.touches ? e.touches[0] : e;
    const base = baseRef.current.getBoundingClientRect();
    const centerX = base.left + base.width / 2;
    const centerY = base.top + base.height / 2;
    const dx = t.clientX - centerX;
    const dy = t.clientY - centerY;
    const len = Math.min(50, Math.hypot(dx, dy));
    const ang = Math.atan2(dy, dx);
    const vx = (Math.cos(ang) * len) / 50;
    const vy = (Math.sin(ang) * len) / 50;
    setRight(vx); setFwd(vy);
    emit(vx, vy);
  };

  const handleEnd = (e) => {
    e.preventDefault();
    setDragging(false); setRight(0); setFwd(0);
    emit(0, 0);
  };

  const knobStyle = {
    transform: `translate(${right * 28}px, ${fwd * 28}px)`,
  };

  return (
    <div
      ref={baseRef}
      className="mobile-joystick"
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
      onPointerLeave={handleEnd}
    >
      <div className="joystick-base" />
      <div className="joystick-knob" style={knobStyle} />
    </div>
  );
}

// ====== 手机端屏幕拖拽环顾 ======
function MobileLookDragger({ enabled }) {
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const start = (e) => {
      if (!enabled) return;
      // 如果是从摇杆区域来的拖拽就不接管
      if (e.target?.closest('.mobile-joystick')) return;
      dragging.current = true;
      const t = e.touches ? e.touches[0] : e;
      lastX.current = t.clientX;
      lastY.current = t.clientY;
    };
    const move = (e) => {
      if (!dragging.current || !enabled) return;
      if (e.target?.closest('.mobile-joystick')) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - lastX.current;
      const dy = t.clientY - lastY.current;
      lastX.current = t.clientX;
      lastY.current = t.clientY;
      window.dispatchEvent(new CustomEvent('touch-look', {
        detail: { yaw: dx * 0.004, pitch: dy * 0.004 }
      }));
    };
    const end = () => { dragging.current = false; };
    window.addEventListener('pointerdown', start);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [enabled]);

  return null;
}

// 漂浮气球：从礼物盒位置升起，各自有独立的上升速度 + 左右摇摆
const BALLOON_COLORS = ['#ff6b8a', '#ffb347', '#ffe066', '#74c0fc', '#8ce99a', '#da77f2', '#ff8787', '#a9e34b', '#748ffc', '#fab005'];

function Balloons() {
  const count = 16;
  const basePos = new THREE.Vector3(0.05, 0.9, -0.15); // 礼物盒上方
  // 每个气球的独立参数：起点偏移、上升速度、摇摆幅度、起始相位
  const params = useRef([...Array(count)].map((_, i) => ({
    ox: (Math.random() - 0.5) * 1.2,
    oz: (Math.random() - 0.5) * 1.2,
    speed: 0.35 + Math.random() * 0.45,
    swayAmp: 0.15 + Math.random() * 0.15,
    swayFreq: 0.9 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    size: 0.28 + Math.random() * 0.14,
    rot: Math.random() * Math.PI,
  }))).current;

  return (
    <group>
      {params.map((p, i) => (
        <FloatingBalloon key={i} p={p} color={BALLOON_COLORS[i % BALLOON_COLORS.length]} base={basePos} />
      ))}
    </group>
  );
}

function FloatingBalloon({ p, color, base }) {
  const ref = useRef();
  const t0 = useRef(performance.now());
  useFrame(() => {
    const t = (performance.now() - t0.current) / 1000;
    // 上升：0.3s 后开始从 gift 底部往上飘，封顶到 y=4.5
    const y = Math.min(4.5, base.y + p.speed * Math.max(0, t - 0.3));
    const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;
    if (ref.current) {
      ref.current.position.x = base.x + p.ox + sway;
      ref.current.position.y = y;
      ref.current.position.z = base.z + p.oz + Math.cos(t * p.swayFreq + p.phase) * p.swayAmp * 0.4;
      ref.current.rotation.z = Math.sin(t * p.swayFreq * 0.5) * 0.08;
    }
  });
  const s = p.size;
  return (
    <group ref={ref} position={[base.x + p.ox, base.y, base.z + p.oz]} rotation={[0, p.rot, 0]}>
      {/* 气球主体（微扁的水滴球形） */}
      <mesh scale={[s, s * 1.15, s]} castShadow>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </mesh>
      {/* 气球底部小尖角 */}
      <mesh position={[0, -s * 1.22, 0]}>
        <coneGeometry args={[s * 0.12, s * 0.2, 8]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      {/* 拉线：一根细细的圆柱体，长度随气球升高的时间变化 */}
      <BalloonString color={color} />
    </group>
  );
}

function BalloonString({ color }) {
  const ref = useRef();
  useFrame((state) => {
    // 让绳子有小幅度的摆动
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.x = Math.sin(t * 2.3 + color.length) * 0.04;
      ref.current.rotation.z = Math.cos(t * 1.7 + color.length) * 0.04;
    }
  });
  return (
    <group ref={ref} position={[0, -0.6, 0]}>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 1.1, 6]} />
        <meshBasicMaterial color="#e9e0d2" />
      </mesh>
    </group>
  );
}

// ===== 精致双层奶油蛋糕 =====
function CakeBase({ position }) {
  // 奶油滴落：围绕底层奶油一圈的 8 个小 sphere，做出奶油往下流的感觉
  const drips = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    const r = 0.41;
    const dropHeight = 0.06 + (i % 3) * 0.015;
    return { angle, r, dropHeight };
  });

  // 顶层草莓位置
  const berries = [[0, 0.03], [0.11, 0.01], [-0.11, 0.01]];

  return (
    <group position={position} castShadow>
      {/* === 底层：香草蛋糕体 === */}
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.28, 48]} />
        <meshStandardMaterial color="#f5d9a8" roughness={0.78} />
      </mesh>

      {/* === 底层奶油顶（稍宽一圈） === */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.41, 0.41, 0.05, 48]} />
        <meshStandardMaterial color="#fff1df" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* === 奶油滴落：一圈往下挂的奶油珠 === */}
      {drips.map((d, i) => {
        const x = Math.cos(d.angle) * d.r;
        const z = Math.sin(d.angle) * d.r;
        return (
          <group key={`drip-${i}`} position={[x, 0.135, z]}>
            <mesh scale={[0.8, 1, 0.8]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial color="#fff1df" roughness={0.3} />
            </mesh>
            {/* 往下拖的尾巴 */}
            <mesh position={[0, -0.035, 0]}>
              <coneGeometry args={[0.018, d.dropHeight, 8]} />
              <meshStandardMaterial color="#fff1df" roughness={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* === 中层：粉色草莓蛋糕 === */}
      <mesh position={[0, 0.31, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 40]} />
        <meshStandardMaterial color="#f7c8d8" roughness={0.75} />
      </mesh>

      {/* === 中层奶油顶 === */}
      <mesh position={[0, 0.40, 0]} castShadow>
        <cylinderGeometry args={[0.285, 0.285, 0.045, 40]} />
        <meshStandardMaterial color="#fff1df" roughness={0.3} />
      </mesh>

      {/* === 顶层奶油花：torus + 中央圆球 === */}
      <mesh position={[0, 0.43, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.2, 0.028, 12, 28]} />
        <meshStandardMaterial color="#ffe8b8" roughness={0.4} />
      </mesh>
      {/* 奶油花中心 */}
      <mesh position={[0, 0.445, 0]} castShadow>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#ffcf9e" roughness={0.5} />
      </mesh>

      {/* === 顶部草莓/樱桃装饰 === */}
      {berries.map(([x, z], i) => (
        <group key={`berry-${i}`} position={[x, 0.485, z]}>
          {/* 果实（红球体 + 尖底 cone 让它更像草莓） */}
          <mesh castShadow>
            <sphereGeometry args={[0.045, 14, 14]} />
            <meshStandardMaterial color={i === 0 ? '#e74c3c' : '#d63031'} roughness={0.55} />
          </mesh>
          {/* 草莓叶（4 片小 sphere 围成一圈） */}
          {Array.from({ length: 4 }).map((_, k) => {
            const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
            return (
              <mesh key={k} position={[Math.cos(a) * 0.03, 0.04, Math.sin(a) * 0.03]} rotation={[0, 0, a]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="#27ae60" roughness={0.6} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* === 糖珠（环绕顶层奶油） === */}
      {Array.from({ length: 20 }).map((_, i) => {
        const a = (i / 20) * Math.PI * 2;
        const colors = ['#ff7b91', '#ffd166', '#8ecae6', '#cdb4db', '#ffffff', '#8ce99a', '#ffb347'];
        return (
          <mesh key={`top-sprinkle-${i}`}
            position={[Math.cos(a) * 0.24, 0.425, Math.sin(a) * 0.24]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color={colors[i % colors.length]} roughness={0.35} metalness={0.1} />
          </mesh>
        );
      })}

      {/* === 底部糖珠（贴在底层奶油顶部边缘） === */}
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const colors = ['#ff7b91', '#ffd166', '#8ecae6', '#cdb4db', '#ffffff'];
        return (
          <mesh key={`bot-sprinkle-${i}`}
            position={[Math.cos(a) * 0.4, 0.185, Math.sin(a) * 0.4]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color={colors[i % colors.length]} roughness={0.35} />
          </mesh>
        );
      })}

      {/* === 小装饰点：底层蛋糕侧面点缀 === */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh key={`side-dot-${i}`}
            position={[Math.cos(a) * 0.382, 0.02 + (i % 3) * 0.07, Math.sin(a) * 0.382]}
            rotation={[0, -a, 0]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial color="#d9a86c" roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// ===== 动态闪烁的蜡烛火焰 =====
function AnimatedFlame({ position }) {
  const meshRef = useRef();
  const lightRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + position[0] * 7; // 每根蜡烛错开相位
    // 火焰高度 + 宽度抖动
    const scaleY = 1 + Math.sin(t * 12) * 0.12 + Math.sin(t * 23) * 0.05;
    const scaleX = 1 - Math.abs(Math.sin(t * 14)) * 0.08;
    meshRef.current.scale.set(scaleX, scaleY, scaleX);
    // 轻微左右摇摆
    meshRef.current.position.x = Math.sin(t * 3) * 0.004;
    meshRef.current.rotation.x = Math.sin(t * 3) * 0.03;
    // 灯光强度同步抖动
    if (lightRef.current) {
      lightRef.current.intensity = 0.35 + Math.sin(t * 10) * 0.18 + Math.random() * 0.06;
    }
  });
  return (
    <group position={position}>
      {/* 蜡烛主体 */}
      <mesh castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.19, 10]} />
        <meshStandardMaterial color="#f4df9c" roughness={0.6} />
      </mesh>
      {/* 烛芯 */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
        <meshBasicMaterial color="#3d2a1f" />
      </mesh>
      {/* 火焰（纺锤形：sphere + 拉伸） */}
      <mesh ref={meshRef} position={[0, 0.145, 0]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshBasicMaterial color="#ffb24d" />
      </mesh>
      {/* 火心（更亮的内焰） */}
      <mesh position={[0, 0.148, 0]} scale={[0.55, 1.2, 0.55]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color="#fff3b0" />
      </mesh>
      {/* 火焰下方光源（轻微发光） */}
      <pointLight ref={lightRef} position={[0, 0.15, 0]} color="#ffb24d" intensity={0.35} distance={1.2} decay={2} />
    </group>
  );
}

function BirthdayScene({ setModal, toggleMusic, setLocked, locked, giftOpen, setGiftOpen, mobileInput }) {
  const [musicOn, setMusicOn] = useState(false);
  const musicToggle = () => {
    const next = !musicOn;
    setMusicOn(next);
    toggleMusic(next);
  };
  return (
    <>
      <color attach="background" args={['#080c14']} />
      <fog attach="fog" args={['#080c14', 12, 28]} />
      {/* 深夜氛围灯光：整体暗，但每盏灯都有自己的彩色光晕 */}
      <ambientLight intensity={1.0} color="#6a7fa8" />
      <hemisphereLight intensity={0.65} color="#3a5a90" groundColor="#141a22" />
      {/* 窗外冷蓝月光 */}
      <directionalLight position={[3, 6, 4]} intensity={1.1} color="#6ea8ff" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      {/* 天花板暖黄主光 */}
      <pointLight position={[0, 3.8, 0]} color="#ffc070" intensity={3.8} distance={14} decay={1.2} />
      {/* 房间里的霓虹补光 */}
      <pointLight position={[-2.5, 3.5, -3.5]} color="#00c8ff" intensity={2.2} distance={8} decay={1.5} />
      <pointLight position={[2.75, 2.5, -2.8]} color="#3a7aff" intensity={2.2} distance={6} decay={1.5} />
      <Room
        onComputer={() => setModal('computer')}
        onHeadphones={musicToggle}
        onGift={() => setGiftOpen(true)}
        giftOpen={giftOpen}
      />
      {giftOpen && <Balloons />}
      <PointerLockControls onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />
      <FirstPersonMovement locked={locked} mobileInput={mobileInput} />
    </>
  );
}

export default function App() {
  const [modal, setModal] = useState('');
  const [locked, setLocked] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  // ===== 检测是否移动端 =====
  const isMobile = typeof navigator !== 'undefined' &&
    (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 800);

  // ===== 耳机播放列表（4 首歌）=====
  const HEADPHONE_PLAYLIST = [
    `${ASSET_BASE}audio/headphone-1-特别的人.mp3`,
    `${ASSET_BASE}audio/headphone-2-麦恩莉.mp3`,
    `${ASSET_BASE}audio/headphone-3-为你写的歌.mp3`,
    `${ASSET_BASE}audio/headphone-4-MyLove.mp3`,
  ];
  const [currentTrack, setCurrentTrack] = useState(0);
  const headphoneAudioRef = useRef(null);

  // Web Audio fallback（mp3 缺失时合成生日快乐）
  const fallbackRef = useRef({ ctx: null, oscillators: [], timer: null, padTimer: null, masterGain: null, playing: false });

  const playTrack = (index) => {
    const audio = headphoneAudioRef.current;
    if (!audio) return;
    audio.src = HEADPHONE_PLAYLIST[index];
    audio.currentTime = 0;
    audio.play().then(() => {
      console.log(`[headphone] playing track ${index + 1}`);
    }).catch(() => {
      // mp3 不存在，跳到下一首；全部没了 fallback
      if (index + 1 < HEADPHONE_PLAYLIST.length) setTimeout(() => playTrack(index + 1), 300);
      else startFallback();
    });
  };

  const toggleMusic = (enabled) => {
    const audio = headphoneAudioRef.current;
    const fb = fallbackRef.current;
    if (!enabled) {
      try { audio?.pause(); } catch {}
      if (audio) audio.currentTime = 0;
      fb.playing = false;
      if (fb.timer) { clearTimeout(fb.timer); fb.timer = null; }
      if (fb.padTimer) { clearTimeout(fb.padTimer); fb.padTimer = null; }
      try { fb.masterGain?.gain.exponentialRampToValueAtTime(0.0001, fb.ctx.currentTime + 0.3); } catch {}
      setTimeout(() => { fb.oscillators.forEach(o => { try { o.stop(); } catch {} }); fb.oscillators = []; }, 350);
      return;
    }
    if (audio) playTrack(currentTrack);
    else startFallback();
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % HEADPHONE_PLAYLIST.length;
    setCurrentTrack(next);
    playTrack(next);
  };

  // ===== Web Audio fallback：合成生日快乐 =====
  const startFallback = () => {
    const s = fallbackRef.current;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!s.ctx) {
        s.ctx = new AudioCtx();
        s.masterGain = s.ctx.createGain();
        s.masterGain.gain.value = 0.0001;
        s.masterGain.connect(s.ctx.destination);
      }
      s.ctx.resume();
      const ctx = s.ctx;
      s.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      s.masterGain.gain.setValueAtTime(s.masterGain.gain.value, ctx.currentTime);
      s.masterGain.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + 0.3);

      const BEAT = 0.35;
      const melody = [
        [261.63, 0.75, 0], [261.63, 0.25, 0.75], [293.66, 1, 1], [261.63, 1, 2], [349.23, 1, 3], [329.63, 2, 4],
        [261.63, 0.75, 6], [261.63, 0.25, 6.75], [293.66, 1, 7], [261.63, 1, 8], [392.00, 1, 9], [349.23, 2, 10],
        [261.63, 0.75, 12], [261.63, 0.25, 12.75], [523.25, 1, 13], [440.00, 1, 14], [349.23, 1, 15], [329.63, 1, 16], [293.66, 2, 17],
        [466.16, 0.75, 19], [466.16, 0.25, 19.75], [440.00, 1, 20], [349.23, 1, 21], [392.00, 1, 22], [349.23, 2, 23],
      ];
      const chords = [
        [261.63, 329.63, 392.00], [261.63, 329.63, 392.00], [220.00, 277.18, 329.63], [246.94, 293.66, 369.99],
        [261.63, 329.63, 392.00], [196.00, 246.94, 293.66], [220.00, 277.18, 329.63], [196.00, 246.94, 293.66],
        [261.63, 329.63, 392.00], [261.63, 329.63, 392.00], [220.00, 277.18, 329.63], [196.00, 246.94, 293.66], [261.63, 329.63, 392.00],
      ];
      s.playing = true;
      const scheduleLoop = () => {
        if (!s.playing) return;
        const loopStart = ctx.currentTime + 0.08;
        melody.forEach(([freq, dur, offset]) => {
          const startTime = loopStart + offset * BEAT;
          const endTime = startTime + dur * BEAT;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle'; osc.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, startTime);
          g.gain.exponentialRampToValueAtTime(0.42, startTime + 0.03);
          g.gain.exponentialRampToValueAtTime(0.28, startTime + 0.18);
          g.gain.exponentialRampToValueAtTime(0.0001, endTime);
          osc.connect(g); g.connect(s.masterGain);
          osc.start(startTime); osc.stop(endTime + 0.05);
          s.oscillators.push(osc);
        });
        s.timer = setTimeout(scheduleLoop, 26 * BEAT * 1000 - 100);
      };
      scheduleLoop();
      let chordIdx = 0;
      const schedulePad = () => {
        if (!s.playing) return;
        const chord = chords[chordIdx % chords.length];
        chordIdx++;
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine'; osc.frequency.value = freq;
          const start = ctx.currentTime;
          g.gain.setValueAtTime(0.0001, start);
          g.gain.linearRampToValueAtTime(0.08, start + 0.8);
          g.gain.linearRampToValueAtTime(0.07, start + 2.8);
          g.gain.exponentialRampToValueAtTime(0.0001, start + 3.8);
          osc.connect(g); g.connect(s.masterGain);
          osc.start(start); osc.stop(start + 3.9);
          s.oscillators.push(osc);
        });
        s.padTimer = setTimeout(schedulePad, 4 * BEAT * 1000);
      };
      schedulePad();
    } catch (e) { console.warn('fallback 失败:', e); }
  };

  useEffect(() => () => {
    const fb = fallbackRef.current;
    fb.playing = false;
    if (fb.timer) clearTimeout(fb.timer);
    if (fb.padTimer) clearTimeout(fb.padTimer);
    fb.oscillators.forEach(o => { try { o.stop(); } catch {} });
    if (fb.ctx) fb.ctx.close();
  }, []);

  return (
    <main className="app-shell">
      <Canvas shadows camera={{ position: [0, 1.65, 4.3], fov: 72 }} dpr={[1, 1.6]}>
        <BirthdayScene setModal={setModal} toggleMusic={toggleMusic} setLocked={setLocked} locked={locked} giftOpen={giftOpen} setGiftOpen={setGiftOpen} mobileInput={isMobile} />
      </Canvas>

      {/* ====== 仅在移动端显示的 controls ====== */}
      {isMobile && (
        <>
          <MobileJoystick />
          <MobileLookDragger enabled={!modal} />
          {/* 手机上不用 PointerLock，进房间直接开始 */}
          {!locked && !modal && (
            <button
              className="primary-btn mobile-enter-btn"
              onClick={() => setLocked(true)}
            >进入房间 <span>↗</span></button>
          )}
        </>
      )}
      <header className="topbar">
        <div className="brand"><span className="brand-dot" /> LITTLE BIRTHDAY ROOM</div>
        <div className="top-tag">A SMALL WORLD, MADE FOR YOU</div>
      </header>
      {!locked && !modal && <div className="welcome-panel">
        <div className="eyebrow">YOUR OWN LITTLE UNIVERSE</div>
        <h1>今晚，来拆一份<br /><em>生日惊喜。</em></h1>
        <p>走进房间，探索桌面上的小秘密。</p>
        <button className="primary-btn" onClick={() => document.querySelector('canvas')?.requestPointerLock?.()}>进入房间 <span>↗</span></button>
        <div className="hint">点击进入后，用鼠标转动视角</div>
      </div>}
      <div className="control-help">
        <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 移动</span>
        <span><kbd>鼠标</kbd> 环顾四周</span>
        <span><kbd>ESC</kbd> 释放鼠标</span>
      </div>
      <div className="crosshair">+</div>
      {locked && <div className="interaction-tip">靠近并点击电脑、耳机或礼物盒</div>}
      {modal && <div className="modal-backdrop" onClick={() => setModal('')}>
        <section className="birthday-modal" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setModal('')} aria-label="关闭">×</button>
          <div className="modal-sparkle">✦ ✧ ✦</div>
          {modal === 'computer' ? <>
            <div className="eyebrow">A SPECIAL MESSAGE FOR YOU</div>
            <h2>生日快乐！</h2>
            {/* 视频播放器：点电脑才开始播放 */}
            <div className="modal-video-wrap">
              <video
                src={`${ASSET_BASE}laptop-screen.mp4`}
                className="modal-video"
                controls
                autoPlay
                playsInline
              />
            </div>
            <p className="small-note">🎂 愿新的一岁，有闪闪发光的日子，也有安心、温柔的小小宇宙。</p>
          </> : <>
            <div className="eyebrow">A LITTLE SURPRISE</div>
            <h2>这份礼物，送给你。</h2>
            <p>愿所有小小的期待，<br />都在新的一岁慢慢实现。</p>
            <div className="cake-emoji">🎁</div>
          </>}
          <button className="primary-btn modal-btn" onClick={() => setModal('')}>收下这份祝福 <span>♡</span></button>
        </section>
      </div>}
      <footer className="footer-note">BUILT WITH LOVE · NO EXTERNAL 3D ASSETS</footer>

      {/* hidden audio：耳机播放列表 */}
      <audio
        ref={headphoneAudioRef}
        preload="auto"
        hidden
        onEnded={() => {
          const next = (currentTrack + 1) % HEADPHONE_PLAYLIST.length;
          setCurrentTrack(next);
          playTrack(next);
        }}
      />

      {/* 播放耳机音乐时显示"下一首"按钮 */}
      {locked && musicOn && (
        <button
          className="bgm-toggle headphone-next"
          onClick={nextTrack}
          title={`切下一首 (${currentTrack + 1}/${HEADPHONE_PLAYLIST.length})`}
        >
          <span className="bgm-icon">⏭</span>
          <span className="bgm-label">NEXT · {currentTrack + 1}/{HEADPHONE_PLAYLIST.length}</span>
        </button>
      )}
    </main>
  );
}
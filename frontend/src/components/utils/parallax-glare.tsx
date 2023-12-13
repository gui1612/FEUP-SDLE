"use client";

import VanillaTilt from "vanilla-tilt";

// styles
import HoverGlareEffect from "../../styles/utils/HoverGlareEffect.module.css";
import "../../styles/utils/HoverGlareEffectOverride.css";

import {
    FaLinkedin,
    FaGithubSquare,
    FaInstagram,
    FaTwitter,
    FaGlobe,
} from "react-icons/fa";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const options = {
    scale: 1.105,
    speed: 1000,
    max: 15,
    glare: true,
};

interface SocialProps {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
}

const LinkList = ({
    linkedin,
    github,
    website,
    twitter,
    instagram,
}: SocialProps) => (
    <div className={HoverGlareEffect.links}>
        {linkedin && (
            <Link to={linkedin} className={HoverGlareEffect.link}>
                <FaLinkedin />
            </Link>
        )}
        {github && (
            <Link to={github} className={HoverGlareEffect.link}>
                <FaGithubSquare />
            </Link>
        )}
        {website && (
            <Link to={website} className={HoverGlareEffect.link}>
                <FaGlobe />
            </Link>
        )}
        {instagram && (
            <Link to={instagram} className={HoverGlareEffect.link}>
                <FaInstagram />
            </Link>
        )}
        {twitter && (
            <Link to={twitter} className={HoverGlareEffect.link}>
                <FaTwitter />
            </Link>
        )}
    </div>
);

interface dataProps {
    name: string;
    linkedin?: string;
    github?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
    imagePath: string;
}

interface GlareEffectProps {
    data: dataProps;
    border?: boolean;
    size?: number;
}

export const ParallaxGlare = ({
    data,
    border = false,
    size = 200,
}: GlareEffectProps) => {
    const { name, linkedin, github, website, twitter, instagram, imagePath } =
        data;
    const tilt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (tilt.current) {
            VanillaTilt.init(tilt.current, options);
        }
    }, [options]);

    return (
        <div
            ref={tilt}
            className={HoverGlareEffect.tilt_container}
            style={{
                height: size + "px",
                width: size + "px",
                border: border ? "5px solid var(--color4)" : "",
            }}
        >
            <img
                src={imagePath}
                width={size}
                height={size}
                style={{borderRadius: "10px", height: "100%" }}
                // className="img-fluid"
                alt="developer"
            />
            <LinkList linkedin={linkedin} website={website} github={github} twitter={twitter} instagram={instagram} />
            <h5 className={HoverGlareEffect.name}>{name}</h5>
        </div>
    );
};
